import { supabase } from './supabaseClient'

// Database helper functions using Supabase
export const db = {
  admin: {
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('Admin')
        .select('*')
        .eq('id', where.id || '')
        .eq('email', where.email || '')
        .single()
      if (error) throw error
      return data
    },
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('Admin').select('*')
      if (where?.activo !== undefined) query = query.eq('activo', where.activo)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('Admin')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('Admin')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  category: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('Category').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('Category')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  service: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let query = supabase.from('Service').select(include?.category ? '*, Category(*)' : '*')
      if (where?.id?.in) query = query.in('id', where.id.in)
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (where?.categoryId) query = query.eq('categoryId', where.categoryId)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('Service')
        .select('*, Category(*)')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data
    },
    create: async ({ data, include }: any) => {
      const { data: result, error } = await supabase
        .from('Service')
        .insert(data)
        .select(include?.category ? '*, Category(*)' : '*')
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('Service')
        .update(data)
        .eq('id', where.id)
        .select('*, Category(*)')
        .single()
      if (error) throw error
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('Service')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
  },
  staff: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('Staff').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('Staff')
        .select('*')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('Staff')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('Staff')
        .update(data)
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  booking: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let query = supabase.from('Booking').select(`
        *,
        ${include?.staff ? 'Staff(*)' : ''},
        ${include?.services ? 'BookingService(*, Service(*))' : ''}
      `)
      if (where?.status) {
        if (where.status.in) query = query.in('status', where.status.in)
        else query = query.eq('status', where.status)
      }
      if (where?.date) query = query.eq('date', where.date.toISOString().split('T')[0])
      if (where?.staffId) query = query.eq('staffId', where.staffId)
      if (orderBy) {
        for (const order of (Array.isArray(orderBy) ? orderBy : [orderBy])) {
          const field = Object.keys(order)[0]
          const direction = order[field] === 'asc'
          query = query.order(field, { ascending: direction })
        }
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    create: async ({ data, include }: any) => {
      const { services, ...bookingData } = data
      const { data: result, error } = await supabase
        .from('Booking')
        .insert(bookingData)
        .select()
        .single()
      if (error) throw error
      
      // Create booking services
      if (services?.create) {
        const bookingServices = services.create.map((s: any) => ({
          bookingId: result.id,
          serviceId: s.serviceId,
        }))
        await supabase.from('BookingService').insert(bookingServices)
      }
      
      // Fetch complete booking with relations if needed
      if (include) {
        const { data: fullBooking } = await supabase
          .from('Booking')
          .select(`*, Staff(*), BookingService(*, Service(*))`)
          .eq('id', result.id)
          .single()
        return fullBooking
      }
      
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('Booking')
        .update(data)
        .eq('id', where.id)
        .select('*, Staff(*)')
        .single()
      if (error) throw error
      return result
    },
  },
  bookingService: {
    findMany: async ({ where, include }: any = {}) => {
      let query = supabase.from('BookingService').select(include?.service ? '*, Service(*)' : '*')
      if (where?.bookingId) query = query.eq('bookingId', where.bookingId)
      const { data, error } = await query
      if (error) throw error
      return data
    },
  },
  promotion: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('Promotion').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (where?.visible !== undefined) query = query.eq('visible', where.visible)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('Promotion')
        .insert(data)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  portfolioImage: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('PortfolioImage').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (where?.category) query = query.eq('category', where.category)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data
    },
  },
}

export const prisma = db

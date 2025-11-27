import { supabase } from './supabaseClient'

export const db = {
  admin: {
    findUnique: async ({ where }: any) => {
      let query = supabase.from('team_members').select('*')
      if (where.id) query = query.eq('id', where.id)
      if (where.email) query = query.eq('email', where.email)
      const { data, error } = await query.single()
      if (error) throw error
      return data ? {
        id: data.id?.toString(),
        email: data.email || '',
        password: '',
        name: data.name,
        rol: data.role || 'admin',
        activo: data.is_active
      } : null
    },
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('team_members').select('*')
      if (where?.activo !== undefined) query = query.eq('is_active', where.activo)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field === 'name' ? 'name' : field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        email: d.email || '',
        password: '',
        name: d.name,
        rol: d.role || 'admin',
        activo: d.is_active
      })) || []
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('team_members')
        .insert({
          name: data.name,
          email: data.email,
          role: data.rol,
          is_active: data.activo
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('team_members')
        .update({
          name: data.name,
          email: data.email,
          role: data.rol,
          is_active: data.activo
        })
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  category: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('service_categories').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        name: d.name,
        slug: d.name.toLowerCase().replace(/\s+/g, '-'),
        active: d.active,
        order: d.display_order
      })) || []
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('service_categories')
        .insert({
          name: data.name,
          description: data.description,
          active: data.active
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  service: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let query = supabase.from('services').select('*')
      if (where?.id?.in) query = query.in('id', where.id.in)
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (where?.categoryId) query = query.eq('category', where.categoryId)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        name: d.name,
        description: d.description,
        price: d.price,
        duration: d.duration_minutes,
        category: d.category,
        categoryId: d.category,
        active: d.active
      })) || []
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data ? {
        id: data.id?.toString(),
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration_minutes,
        category: data.category,
        categoryId: data.category,
        active: data.active
      } : null
    },
    create: async ({ data, include }: any) => {
      const { data: result, error } = await supabase
        .from('services')
        .insert({
          name: data.name,
          description: data.description,
          price: data.price,
          duration_minutes: data.duration,
          category: data.categoryId,
          active: data.active
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('services')
        .update({
          name: data.name,
          description: data.description,
          price: data.price,
          duration_minutes: data.duration,
          category: data.categoryId,
          active: data.active
        })
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
  },
  staff: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('team_members').select('*')
      if (where?.active !== undefined) query = query.eq('is_active', where.active)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        name: d.name,
        email: d.email,
        phone: d.phone,
        specialty: d.specialty,
        bio: d.bio,
        photoUrl: d.image,
        active: d.is_active,
        workSchedule: '{}'
      })) || []
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data ? {
        id: data.id?.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialty: data.specialty,
        bio: data.bio,
        photoUrl: data.image,
        active: data.is_active,
        workSchedule: '{}'
      } : null
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('team_members')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          specialty: data.specialty,
          bio: data.bio,
          image: data.photoUrl,
          is_active: data.active
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('team_members')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          specialty: data.specialty,
          bio: data.bio,
          image: data.photoUrl,
          is_active: data.active
        })
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  booking: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let query = supabase.from('appointments').select('*, team_members(*)')
      if (where?.status) {
        if (where.status.in) query = query.in('status', where.status.in)
        else query = query.eq('status', where.status)
      }
      if (where?.date) query = query.eq('date', where.date.toISOString().split('T')[0])
      if (where?.staffId) query = query.eq('stylist_id', where.staffId)
      if (orderBy) {
        for (const order of (Array.isArray(orderBy) ? orderBy : [orderBy])) {
          const field = Object.keys(order)[0]
          const direction = order[field] === 'asc'
          query = query.order(field, { ascending: direction })
        }
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        clientName: d.client_name,
        clientPhone: d.phone,
        clientEmail: d.email,
        date: new Date(d.date),
        startTime: d.start_time,
        endTime: d.end_time,
        status: d.status,
        notes: d.notes,
        staffId: d.stylist_id?.toString(),
        staff: d.team_members ? {
          id: d.team_members.id?.toString(),
          name: d.team_members.name
        } : null
      })) || []
    },
    create: async ({ data, include }: any) => {
      const { services, ...bookingData } = data
      const { data: result, error } = await supabase
        .from('appointments')
        .insert({
          client_name: bookingData.clientName,
          phone: bookingData.clientPhone,
          email: bookingData.clientEmail,
          date: bookingData.date,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          status: bookingData.status,
          notes: bookingData.notes,
          stylist_id: bookingData.staffId
        })
        .select()
        .single()
      if (error) throw error
      if (services?.create) {
        const appointmentServices = services.create.map((s: any) => ({
          appointment_id: result.id,
          service_id: s.serviceId,
        }))
        await supabase.from('appointment_services').insert(appointmentServices)
      }
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('appointments')
        .update({
          client_name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
          status: data.status,
          notes: data.notes
        })
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  bookingService: {
    findMany: async ({ where, include }: any = {}) => {
      let query = supabase.from('appointment_services').select('*')
      if (where?.bookingId) query = query.eq('appointment_id', where.bookingId)
      const { data, error } = await query
      if (error) throw error
      if (include?.service && data) {
        const serviceIds = data.map((d: any) => d.service_id)
        const { data: services } = await supabase
          .from('services')
          .select('*')
          .in('id', serviceIds)
        const serviceMap = new Map(services?.map((s: any) => [s.id, s]) || [])
        return data.map((d: any) => ({
          id: d.id?.toString(),
          bookingId: d.appointment_id?.toString(),
          serviceId: d.service_id?.toString(),
          service: serviceMap.get(d.service_id) ? {
            id: serviceMap.get(d.service_id).id?.toString(),
            name: serviceMap.get(d.service_id).name,
            duration: serviceMap.get(d.service_id).duration_minutes
          } : null
        }))
      }
      return data?.map((d: any) => ({
        id: d.id?.toString(),
        bookingId: d.appointment_id?.toString(),
        serviceId: d.service_id?.toString(),
        service: null
      })) || []
    },
  },
  promotion: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('promotions').select('*')
      if (where?.active !== undefined) query = query.eq('is_active', where.active)
      if (where?.visible !== undefined) query = query.eq('show_on_site', where.visible)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        name: d.name,
        description: d.description,
        discount: 0,
        startDate: d.valid_from,
        endDate: d.valid_until,
        active: d.is_active,
        visible: d.show_on_site
      })) || []
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('promotions')
        .insert({
          name: data.name,
          description: data.description,
          valid_from: data.startDate,
          valid_until: data.endDate,
          is_active: data.active,
          show_on_site: data.visible
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
  },
  portfolioImage: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('gallery').select('*')
      if (where?.active !== undefined) query = query.eq('visible', where.active)
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        url: d.image_url,
        category: 'general',
        caption: d.title,
        active: d.visible
      })) || []
    },
  },
}

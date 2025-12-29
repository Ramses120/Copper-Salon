import { supabase } from './supabaseClient'

export const db = {
  category: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('categories').select('*')
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
        .from('categories')
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
        category: d.category_id, // Fixed: use category_id column
        categoryId: d.category_id, // Fixed: use category_id column
        category_id: d.category_id, // Added for compatibility
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
      let query = supabase.from('staff').select('*')
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
        email: d.email,
        phone: d.phone,
        specialties: d.specialties || '[]',
        bio: d.notes,
        photoUrl: d.photo_url,
        active: d.active,
        workSchedule: d.work_schedule || '{}'
      })) || []
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data ? {
        id: data.id?.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialties: data.specialties || '[]',
        bio: data.notes,
        photoUrl: data.photo_url,
        active: data.active,
        workSchedule: data.work_schedule || '{}'
      } : null
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('staff')
        .insert({
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          specialties: data.specialties || '[]',
          notes: data.bio || '',
          photo_url: data.photoUrl || '',
          active: data.active ?? true,
          work_schedule: data.workSchedule || '{}'
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    update: async ({ where, data }: any) => {
      const { data: result, error } = await supabase
        .from('staff')
        .update({
          name: data.name,
          email: data.email || '',
          phone: data.phone,
          specialties: data.specialties || '[]',
          notes: data.bio || '',
          photo_url: data.photoUrl || '',
          active: data.active ?? true,
          work_schedule: data.workSchedule || '{}'
        })
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
  },
  booking: {
    findMany: async ({ where, include, orderBy }: any = {}) => {
      let query = supabase.from('bookings').select(`
        *,
        customer:customers(*),
        staff:staff(*),
        services:booking_services(
          service:services(*)
        )
      `)
      
      if (where?.status) {
        if (where.status.in) query = query.in('status', where.status.in)
        else query = query.eq('status', where.status)
      }
      if (where?.date) {
         if (where.date.gte || where.date.lte) {
             if (where.date.gte) {
                 const dateStr = where.date.gte instanceof Date ? where.date.gte.toISOString().split('T')[0] : where.date.gte;
                 query = query.gte('booking_date', dateStr)
             }
             if (where.date.lte) {
                 const dateStr = where.date.lte instanceof Date ? where.date.lte.toISOString().split('T')[0] : where.date.lte;
                 query = query.lte('booking_date', dateStr)
             }
         } else {
             const dateStr = where.date instanceof Date ? where.date.toISOString().split('T')[0] : where.date;
             query = query.eq('booking_date', dateStr)
         }
      }
      if (where?.staffId) query = query.eq('staff_id', where.staffId)
      
      if (orderBy) {
        for (const order of (Array.isArray(orderBy) ? orderBy : [orderBy])) {
          const field = Object.keys(order)[0]
          const dbField = field === 'date' ? 'booking_date' : field;
          const direction = order[field] === 'asc'
          query = query.order(dbField, { ascending: direction })
        }
      }
      
      const { data, error } = await query
      if (error) throw error
      
      return data?.map((d: any) => ({
        id: d.id?.toString(),
        clientName: d.customer?.name || 'Cliente Desconocido',
        clientPhone: d.customer?.phone || '',
        clientEmail: d.customer?.email || '',
        date: new Date(d.booking_date),
        startTime: d.start_time,
        endTime: d.end_time,
        status: d.status,
        notes: d.notes,
        staffId: d.staff_id?.toString(),
        staff: d.staff ? {
          id: d.staff.id?.toString(),
          name: d.staff.name
        } : null,
        services: d.services?.map((bs: any) => ({
            id: bs.id?.toString(),
            bookingId: bs.booking_id?.toString(),
            serviceId: bs.service_id?.toString(),
            service: bs.service ? {
              id: bs.service.id?.toString(),
              name: bs.service.name,
              price: bs.service.price,
              duration: bs.service.duration_minutes
            } : null
        })) || []
      })) || []
    },
    findUnique: async ({ where, include }: any) => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          customer:customers(*),
          staff:staff(*),
          services:booking_services(
            service:services(*)
          )
        `)
        .eq('id', where.id)
        .single()
      if (error) throw error
      
      return data ? {
        id: data.id?.toString(),
        clientName: data.customer?.name || 'Cliente Desconocido',
        clientPhone: data.customer?.phone || '',
        clientEmail: data.customer?.email || '',
        date: new Date(data.booking_date),
        startTime: data.start_time,
        endTime: data.end_time,
        status: data.status,
        notes: data.notes,
        staffId: data.staff_id?.toString(),
        staff: data.staff ? {
          id: data.staff.id?.toString(),
          name: data.staff.name
        } : null,
        services: data.services?.map((bs: any) => ({
            id: bs.id?.toString(),
            bookingId: bs.booking_id?.toString(),
            serviceId: bs.service_id?.toString(),
            service: bs.service ? {
              id: bs.service.id?.toString(),
              name: bs.service.name,
              price: bs.service.price,
              duration: bs.service.duration_minutes
            } : null
        })) || []
      } : null
    },
    create: async ({ data, include }: any) => {
      const { services, ...bookingData } = data
      
      let customerId = bookingData.customerId;
      if (!customerId && bookingData.clientPhone) {
          const { data: customer } = await supabase.from('customers').select('id').eq('phone', bookingData.clientPhone).single();
          if (customer) customerId = customer.id;
          else {
              const { data: newCustomer } = await supabase.from('customers').insert({
                  name: bookingData.clientName,
                  phone: bookingData.clientPhone,
                  email: bookingData.clientEmail
              }).select().single();
              customerId = newCustomer?.id;
          }
      }

      const { data: result, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: customerId,
          booking_date: bookingData.date,
          start_time: bookingData.startTime,
          end_time: bookingData.endTime,
          status: bookingData.status,
          notes: bookingData.notes,
          staff_id: bookingData.staffId
        })
        .select()
        .single()
      if (error) throw error
      
      if (services?.create) {
        const bookingServices = services.create.map((s: any) => ({
          booking_id: result.id,
          service_id: s.serviceId,
        }))
        await supabase.from('booking_services').insert(bookingServices)
      }
      return result
    },
    update: async ({ where, data }: any) => {
      const updateFields: any = {};
      if (data.status) updateFields.status = data.status;
      if (data.notes !== undefined) updateFields.notes = data.notes;
      if (data.date) updateFields.booking_date = data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date;
      if (data.startTime) updateFields.start_time = data.startTime;
      if (data.endTime) updateFields.end_time = data.endTime;
      if (data.staffId) updateFields.staff_id = data.staffId;
      
      const { data: result, error } = await supabase
        .from('bookings')
        .update(updateFields)
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      
      // Handle customer update if provided
      if (data.clientName || data.clientPhone) {
          const { data: booking } = await supabase.from('bookings').select('customer_id').eq('id', where.id).single();
          if (booking?.customer_id) {
              const customerUpdate: any = {};
              if (data.clientName) customerUpdate.name = data.clientName;
              if (data.clientPhone) customerUpdate.phone = data.clientPhone;
              if (data.clientEmail !== undefined) customerUpdate.email = data.clientEmail;
              
              await supabase.from('customers').update(customerUpdate).eq('id', booking.customer_id);
          }
      }
      
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
    count: async ({ where }: any) => {
      let query = supabase.from('bookings').select('id', { count: 'exact', head: true })
      if (where?.status) {
        if (where.status.in) query = query.in('status', where.status.in)
        else query = query.eq('status', where.status)
      }
      if (where?.date) {
         if (where.date.gte || where.date.lte) {
             if (where.date.gte) {
                 const dateStr = where.date.gte instanceof Date ? where.date.gte.toISOString().split('T')[0] : where.date.gte;
                 query = query.gte('booking_date', dateStr)
             }
             if (where.date.lte) {
                 const dateStr = where.date.lte instanceof Date ? where.date.lte.toISOString().split('T')[0] : where.date.lte;
                 query = query.lte('booking_date', dateStr)
             }
         } else {
             const dateStr = where.date instanceof Date ? where.date.toISOString().split('T')[0] : where.date;
             query = query.eq('booking_date', dateStr)
         }
      }
      if (where?.staffId) query = query.eq('staff_id', where.staffId)
      const { count, error } = await query
      if (error) throw error
      return count || 0
    },
    groupBy: async ({ by, where, _count }: any) => {
      let query = supabase.from('bookings').select('status')
      if (where?.date) {
         if (where.date.gte) {
            const dateStr = where.date.gte instanceof Date ? where.date.gte.toISOString().split('T')[0] : where.date.gte;
            query = query.gte('booking_date', dateStr)
         }
         // Add other date filters if needed for groupBy
      }
      const { data, error } = await query
      if (error) throw error
      
      const grouped = new Map<string, number>()
      data?.forEach((row: any) => {
        const status = row.status
        grouped.set(status, (grouped.get(status) || 0) + 1)
      })
      
      return Array.from(grouped.entries()).map(([status, count]) => ({
        status,
        _count: { _all: count }
      }))
    },
  },
  bookingService: {
    findMany: async ({ where, include }: any = {}) => {
      let query = supabase.from('booking_services').select('*')
      if (where?.bookingId) query = query.eq('booking_id', where.bookingId)
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
          bookingId: d.booking_id?.toString(),
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
        bookingId: d.booking_id?.toString(),
        serviceId: d.service_id?.toString(),
        service: null
      })) || []
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('booking_services')
        .insert({
          booking_id: data.bookingId,
          service_id: data.serviceId,
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('booking_services')
        .delete()
        .eq('id', where.id)
      if (error) throw error
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
      let query = supabase.from('portfolio_images').select('*')
      if (orderBy) {
        const field = Object.keys(orderBy)[0]
        const direction = orderBy[field] === 'asc'
        query = query.order(field, { ascending: direction })
      }
      const { data, error } = await query
      if (error) throw error
      return data?.map(d => ({
        id: d.id?.toString(),
        url: d.url,
        category: d.category,
        caption: d.caption,
        created_at: d.created_at,
        categoria: d.category,
        descripcion: d.caption,
        fechaCreacion: d.created_at
      })) || []
    },
    create: async ({ data }: any) => {
      const { data: result, error } = await supabase
        .from('portfolio_images')
        .insert({
          url: data.url,
          category: data.category,
          caption: data.caption
        })
        .select()
        .single()
      if (error) throw error
      return result
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('portfolio_images')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
  },
  customer: {
    findMany: async ({ where, orderBy }: any = {}) => {
      let query = supabase.from('customers').select('*')
      if (where?.active !== undefined) query = query.eq('active', where.active)
      if (where?.phone) query = query.eq('phone', where.phone)
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
        phone: d.phone,
        notes: d.notes || '',
        active: d.active,
        created_at: d.created_at,
        updated_at: d.updated_at
      })) || []
    },
    findUnique: async ({ where }: any) => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', where.id)
        .single()
      if (error) throw error
      return data ? {
        id: data.id?.toString(),
        name: data.name,
        phone: data.phone,
        notes: data.notes || '',
        active: data.active,
        created_at: data.created_at,
        updated_at: data.updated_at
      } : null
    },
    create: async ({ data }: any) => {
      console.log("[db.customer.create] Inserting customer:", { name: data.name, phone: data.phone });
      
      const { data: result, error } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          phone: data.phone,
          notes: data.notes || '',
          active: true
        })
        .select()
        .single()
      
      if (error) {
        console.error("[db.customer.create] Supabase error:", error);
        throw new Error(`Supabase insert error: ${error.message}`);
      }
      
      console.log("[db.customer.create] Customer inserted successfully:", result);
      
      return {
        id: result.id?.toString(),
        name: result.name,
        phone: result.phone,
        notes: result.notes || '',
        active: result.active,
        created_at: result.created_at,
        updated_at: result.updated_at
      }
    },
    update: async ({ where, data }: any) => {
      const updateData: any = {}
      if (data.name) updateData.name = data.name
      if (data.phone) updateData.phone = data.phone
      if (data.notes !== undefined) updateData.notes = data.notes
      if (data.active !== undefined) updateData.active = data.active

      const { data: result, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', where.id)
        .select()
        .single()
      if (error) throw error
      return {
        id: result.id?.toString(),
        name: result.name,
        phone: result.phone,
        notes: result.notes || '',
        active: result.active,
        created_at: result.created_at,
        updated_at: result.updated_at
      }
    },
    delete: async ({ where }: any) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', where.id)
      if (error) throw error
    },
  },
}

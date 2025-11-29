"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, Clock, ChevronDown } from "lucide-react";

const specialties = [
  "Colorista & Estilista",
  "Maquilladora Profesional",
  "Especialista en Uñas",
  "Esteticista",
  "Técnico en Extensiones",
  "Estilista General",
];

const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  // Sunday (0) is excluded - it's a day off
];

interface Staff {
  id: string;
  nombre: string;
  especialidades: string[];
  telefono: string;
  activo: boolean;
}

interface Schedule {
  id: string;
  weekday: number;
  dayName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function AdminEstilistasPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedStaff, setExpandedStaff] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [editingSchedule, setEditingSchedule] = useState<{
    staffId: string;
    weekday: number;
  } | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState({
    startTime: "09:00",
    endTime: "17:30",
  });
  const [formData, setFormData] = useState({
    nombre: "",
    especialidades: [] as string[],
    telefono: "",
    activo: true,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      if (response.ok) {
        const data = await response.json();
        const staffList = Array.isArray(data) ? data : data.staff || [];
        setStaff(staffList);
      }
    } catch (error) {
      console.error('Error al cargar estilistas:', error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async (staffId: string) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/schedules`);
      if (response.ok) {
        const data = await response.json();
        setSchedules((prev) => ({
          ...prev,
          [staffId]: data.schedules || [],
        }));
      }
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Solo se aceptan imágenes');
        return;
      }
    }
  };

  const toggleEspecialidad = (especialidad: string) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades.includes(especialidad)
        ? prev.especialidades.filter((e) => e !== especialidad)
        : [...prev.especialidades, especialidad],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.especialidades.length === 0) {
      alert('Debes seleccionar al menos una especialidad');
      return;
    }

    setLoading(true);

    try {
      const url = editingId ? `/api/staff/${editingId}` : '/api/staff';
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar estilista');
      }

      await fetchStaff();
      resetForm();
      alert(editingId ? 'Estilista actualizado exitosamente' : 'Estilista agregado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al guardar estilista');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s: Staff) => {
    setFormData({
      nombre: s.nombre,
      especialidades: s.especialidades || [],
      telefono: s.telefono,
      activo: s.activo,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este estilista?")) return;

    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchStaff();
        alert('Estilista eliminado exitosamente');
      } else {
        throw new Error('Error al eliminar');
      }
    } catch (error) {
      alert('Error al eliminar estilista');
    }
  };

  const handleToggleStaffExpand = async (staffId: string) => {
    if (expandedStaff === staffId) {
      setExpandedStaff(null);
    } else {
      setExpandedStaff(staffId);
      if (!schedules[staffId]) {
        await fetchSchedules(staffId);
      }
    }
  };

  const handleAddSchedule = async (staffId: string, weekday: number) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekday,
          startTime: scheduleFormData.startTime,
          endTime: scheduleFormData.endTime,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar horario');

      await fetchSchedules(staffId);
      setEditingSchedule(null);
      alert('Horario guardado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al guardar horario');
    }
  };

  const handleUpdateSchedule = async (
    staffId: string,
    scheduleId: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/schedules`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduleId,
          startTime,
          endTime,
          isActive: true,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar horario');

      await fetchSchedules(staffId);
      alert('Horario actualizado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al actualizar horario');
    }
  };

  const handleDeleteSchedule = async (staffId: string, scheduleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este horario?")) return;

    try {
      const response = await fetch(`/api/staff/${staffId}/schedules`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId }),
      });

      if (!response.ok) throw new Error('Error al eliminar horario');

      await fetchSchedules(staffId);
      alert('Horario eliminado exitosamente');
    } catch (error: any) {
      alert(error.message || 'Error al eliminar horario');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      especialidades: [],
      telefono: "",
      activo: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#E46768]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-times text-3xl font-bold text-gray-900 mb-2">
            Estilistas
          </h1>
          <p className="text-gray-600">Gestiona el equipo del salón</p>
        </div>
        <Button variant="copper" onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={18} />
          Agregar Estilista
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">
              {editingId ? "Editar Estilista" : "Agregar Nuevo Estilista"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  placeholder="Ej: María García"
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono * (Solo para admin)</Label>
                <Input
                  id="telefono"
                  required
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  placeholder="(786) 555-0123"
                />
              </div>

              <div>
                <Label>Especialidades * (Selecciona al menos una)</Label>
                <div className="space-y-2 mt-2 p-3 border rounded bg-gray-50">
                  {specialties.map((specialty) => (
                    <label key={specialty} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.especialidades.includes(specialty)}
                        onChange={() => toggleEspecialidad(specialty)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{specialty}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Estado</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.activo === true}
                      onChange={() => setFormData({ ...formData, activo: true })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Activo</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.activo === false}
                      onChange={() => setFormData({ ...formData, activo: false })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Inactivo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="copper" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      {editingId ? "Actualizar" : "Agregar"} Estilista
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Staff List */}
      <div className="grid gap-4">
        {staff.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">No hay estilistas registrados</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {staff.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Staff Header */}
                  <div className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{s.nombre}</h3>
                          <p className="text-sm text-gray-600">{s.telefono}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.especialidades && s.especialidades.length > 0 ? (
                          s.especialidades.map((esp) => (
                            <Badge
                              key={esp}
                              className="text-xs bg-pink-50 text-pink-700 border border-pink-200"
                            >
                              {esp}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">Sin especialidades</span>
                        )}
                      </div>
                      <Badge className={`mt-2 ${s.activo ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                        {s.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStaffExpand(s.id)}
                        className="gap-2"
                      >
                        <Clock size={16} />
                        Horarios
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            expandedStaff === s.id ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(s)}
                      >
                        <Edit size={16} className="mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Schedules Section */}
                  {expandedStaff === s.id && (
                    <div className="border-t bg-gray-50 p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Horarios de Trabajo (9:00 AM - 5:30 PM)
                      </h4>

                      {/* Existing Schedules */}
                      {schedules[s.id] && schedules[s.id].length > 0 ? (
                        <div className="space-y-3 mb-6">
                          {schedules[s.id].map((schedule) => (
                            <div
                              key={schedule.id}
                              className="flex items-center gap-3 bg-white p-3 rounded border"
                            >
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">
                                  {schedule.dayName}
                                </p>
                                <div className="flex gap-3 mt-2">
                                  <div>
                                    <Label className="text-xs text-gray-600">Inicio</Label>
                                    <Input
                                      type="time"
                                      defaultValue={schedule.startTime}
                                      onBlur={(e) =>
                                        handleUpdateSchedule(
                                          s.id,
                                          schedule.id,
                                          e.currentTarget.value,
                                          schedule.endTime
                                        )
                                      }
                                      className="w-24 text-sm"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-600">Fin</Label>
                                    <Input
                                      type="time"
                                      defaultValue={schedule.endTime}
                                      onBlur={(e) =>
                                        handleUpdateSchedule(
                                          s.id,
                                          schedule.id,
                                          schedule.startTime,
                                          e.currentTarget.value
                                        )
                                      }
                                      className="w-24 text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSchedule(s.id, schedule.id)
                                }
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-6">
                          Sin horarios asignados
                        </p>
                      )}

                      {/* Add Schedule */}
                      {editingSchedule?.staffId === s.id ? (
                        <div className="bg-white p-4 rounded border space-y-4">
                          <div>
                            <Label>Día de la semana</Label>
                            <select
                              value={editingSchedule.weekday}
                              onChange={(e) =>
                                setEditingSchedule({
                                  ...editingSchedule,
                                  weekday: parseInt(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 border rounded mt-1"
                            >
                              <option value="">Selecciona un día</option>
                              {WEEKDAYS.map((day) => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Hora de inicio</Label>
                              <Input
                                type="time"
                                value={scheduleFormData.startTime}
                                onChange={(e) =>
                                  setScheduleFormData({
                                    ...scheduleFormData,
                                    startTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label>Hora de fin</Label>
                              <Input
                                type="time"
                                value={scheduleFormData.endTime}
                                onChange={(e) =>
                                  setScheduleFormData({
                                    ...scheduleFormData,
                                    endTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="copper"
                              size="sm"
                              onClick={() => {
                                if (editingSchedule.weekday) {
                                  handleAddSchedule(s.id, editingSchedule.weekday);
                                }
                              }}
                            >
                              Guardar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingSchedule(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSchedule({
                              staffId: s.id,
                              weekday: 1,
                            });
                            setScheduleFormData({
                              startTime: "09:00",
                              endTime: "17:30",
                            });
                          }}
                          className="w-full"
                        >
                          <Plus size={16} className="mr-2" />
                          Agregar Horario
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

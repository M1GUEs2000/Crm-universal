import { useEffect, useState } from 'react'
import KpiCard from '@/components/KpiCard'
import { Card, PageHeader, Spinner } from '@/components/ui'
import { estadisticaService } from '@/services'
import type { PuntoGrafico, ResumenDashboard } from '@/types'
import { estadisticasConfig, estadisticaSeries, maxPuntoValor, resumenKpis } from './config'

type SeriesKey = typeof estadisticaSeries[number]['key']
type SeriesState = Record<SeriesKey, PuntoGrafico[]>

const seriesLoaders = {
  clientesPorMes: () => estadisticaService.clientesPorMes(),
  citasPorEstado: () => estadisticaService.citasPorEstado(),
  productosMasVendidos: () => estadisticaService.productosMasVendidos(),
}

function SerieCard({ title, data }: { title: string; data: PuntoGrafico[] }) {
  const max = maxPuntoValor(data)

  return (
    <Card>
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-text">{title}</h2>
        {data.length === 0 ? (
          <p className="text-sm text-text-muted">{estadisticasConfig.emptyText}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.map(punto => (
              <div key={punto.etiqueta} className="grid grid-cols-[minmax(80px,120px)_1fr_auto] items-center gap-3">
                <span className="text-xs text-text-muted truncate">{punto.etiqueta}</span>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max((punto.valor / max) * 100, 4)}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text">{punto.valor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function EstadisticasPage() {
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null)
  const [series, setSeries] = useState<SeriesState>({
    clientesPorMes: [],
    citasPorEstado: [],
    productosMasVendidos: [],
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargar() {
      setCargando(true)
      const [resumenResult, ...seriesResults] = await Promise.all([
        estadisticaService.resumenDashboard(),
        ...estadisticaSeries.map(serie => seriesLoaders[serie.key as keyof typeof seriesLoaders]()),
      ])

      if (resumenResult.ok) setResumen(resumenResult.datos)

      setSeries(estadisticaSeries.reduce<SeriesState>((acc, serie, index) => {
        const result = seriesResults[index]
        acc[serie.key] = result?.ok ? result.datos : []
        return acc
      }, {
        clientesPorMes: [],
        citasPorEstado: [],
        productosMasVendidos: [],
      }))

      setCargando(false)
    }

    cargar()
  }, [])

  if (cargando) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={estadisticasConfig.title} />

      {resumen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {resumenKpis.map(kpi => (
            <KpiCard key={kpi.key} {...resumen[kpi.key]} icon={kpi.icon} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {estadisticaSeries.map(serie => (
          <SerieCard key={serie.key} title={serie.title} data={series[serie.key]} />
        ))}
      </div>
    </div>
  )
}

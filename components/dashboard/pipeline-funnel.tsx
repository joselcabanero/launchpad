'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { colors, chartColors } from '@/lib/colors'

interface FunnelData {
    stage: string
    count: number
}

export default function PipelineFunnel({ data }: { data: FunnelData[] }) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current || !data.length) return

        const margin = { top: 40, right: 20, bottom: 40, left: 20 }
        const width = svgRef.current.parentElement?.clientWidth || 1000
        const height = 300 - margin.top - margin.bottom

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const g = svg
            .attr('width', width)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        const stageWidth = (width - margin.left - margin.right) / data.length
        const maxCount = d3.max(data, d => d.count) || 10
        const yScale = d3.scaleLinear()
            .domain([0, maxCount])
            .range([0, height / 2])

        // Draw stages
        data.forEach((d, i) => {
            const xStart = i * stageWidth
            const xEnd = (i + 1) * stageWidth

            const currentYValue = yScale(d.count)
            const nextYValue = i < data.length - 1 ? yScale(data[i + 1].count) : currentYValue

            const p1 = [xStart, height / 2 - currentYValue]
            const p2 = [xEnd, height / 2 - nextYValue]
            const p3 = [xEnd, height / 2 + nextYValue]
            const p4 = [xStart, height / 2 + currentYValue]

            const points = `${p1.join(',')},${p2.join(',')},${p3.join(',')},${p4.join(',')}`

            g.append('polygon')
                .attr('points', points)
                .attr('fill', chartColors[i % chartColors.length])
                .attr('opacity', 0)
                .transition()
                .duration(400)
                .delay(i * 100)
                .attr('opacity', 0.9)

            // Label inside
            g.append('text')
                .attr('x', xStart + stageWidth / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', i < 4 ? colors.textInverse : colors.textPrimary)
                .style('font-family', 'Inter')
                .style('font-weight', '700')
                .style('font-size', '14px')
                .text(d.count)

            g.append('text')
                .attr('x', xStart + stageWidth / 2)
                .attr('y', height / 2 + 20)
                .attr('text-anchor', 'middle')
                .attr('fill', i < 4 ? 'rgba(255,255,255,0.8)' : colors.textMuted)
                .style('font-family', 'Inter')
                .style('font-size', '10px')
                .text(d.stage)

            // Conversion percent
            if (i < data.length - 1) {
                const conversion = Math.round((data[i + 1].count / d.count) * 100) || 0
                g.append('text')
                    .attr('x', xEnd)
                    .attr('y', height / 2 - 30)
                    .attr('text-anchor', 'middle')
                    .attr('fill', colors.accentDanger)
                    .style('font-family', 'Inter')
                    .style('font-weight', '700')
                    .style('font-size', '11px')
                    .text(`${conversion}%`)
            }
        })

    }, [data])

    return (
        <Card className="bg-surface border-border">
            <CardHeader>
                <CardTitle className="text-base font-medium text-text-primary">Pipeline Funnel</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <svg ref={svgRef}></svg>
            </CardContent>
        </Card>
    )
}

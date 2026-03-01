'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RadarData {
    axis: string
    value: number // 1-5
}

export default function ScoreRadar({ data }: { data: RadarData[] }) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current || !data.length) return

        const width = 300
        const height = 300
        const margin = 50
        const radius = Math.min(width, height) / 2 - margin
        const levels = 5
        const maxValue = 5

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)

        const angleSlice = (Math.PI * 2) / data.length

        const rScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, radius])

        // Draw background circles
        for (let j = 0; j < levels; j++) {
            const levelFactor = radius * ((j + 1) / levels)
            g.selectAll(`.levels-${j}`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (_d, i) => levelFactor * Math.cos(angleSlice * i - Math.PI / 2))
                .attr('y1', (_d, i) => levelFactor * Math.sin(angleSlice * i - Math.PI / 2))
                .attr('x2', (_d, i) => levelFactor * Math.cos(angleSlice * (i + 1) - Math.PI / 2))
                .attr('y2', (_d, i) => levelFactor * Math.sin(angleSlice * (i + 1) - Math.PI / 2))
                .style('stroke', '#F0E8D0')
                .style('stroke-width', '0.5px')
        }

        // Axes
        const axis = g.selectAll('.axis')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'axis')

        axis.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', (_d, i) => radius * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y2', (_d, i) => radius * Math.sin(angleSlice * i - Math.PI / 2))
            .style('stroke', '#F0E8D0')
            .style('stroke-width', '1px')

        axis.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .attr('x', (_d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('y', (_d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
            .text(d => d.axis)
            .style('font-family', 'Inter')
            .style('font-size', '9px')
            .style('font-weight', '600')
            .style('fill', '#6B5C4E')
            .style('text-transform', 'uppercase')

        // Radar line
        const radarLine = d3.lineRadial<RadarData>()
            .radius(d => rScale(d.value))
            .angle((_d, i) => i * angleSlice)
            .curve(d3.curveLinearClosed)

        const radarArea = g.append('path')
            .datum(data)
            .attr('d', radarLine)
            .style('fill', '#FFA103')
            .style('fill-opacity', 0)
            .style('stroke', '#FFA103')
            .style('stroke-width', '2px')

        radarArea.transition()
            .duration(600)
            .style('fill-opacity', 0.2)

        // Points
        g.selectAll('.radarCircle')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'radarCircle')
            .attr('r', 4)
            .attr('cx', (_d, i) => rScale(_d.value) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr('cy', (_d, i) => rScale(_d.value) * Math.sin(angleSlice * i - Math.PI / 2))
            .style('fill', '#FFA103')
            .style('fill-opacity', 0.8)
            .style('opacity', 0)
            .transition()
            .duration(600)
            .style('opacity', 1)

    }, [data])

    return (
        <Card className="bg-surface border-border">
            <CardHeader className="pb-0">
                <CardTitle className="text-[12px] font-bold text-text-muted uppercase tracking-wider text-center">Score Breakdown (Round 2)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[320px]">
                <svg ref={svgRef}></svg>
            </CardContent>
        </Card>
    )
}

'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { colors } from '@/lib/colors'

interface BarData {
    name: string
    count: number
}

export default function ApplicationsBar({ data }: { data: BarData[] }) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current || !data.length) return

        const margin = { top: 20, right: 60, bottom: 40, left: 120 }
        const width = svgRef.current.parentElement?.clientWidth || 600
        const height = 300 - margin.top - margin.bottom

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const g = svg
            .attr('width', width)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count) || 10])
            .range([0, width - margin.left - margin.right])

        const y = d3.scaleBand()
            .domain(data.map(d => d.name.substring(0, 20)))
            .range([0, height])
            .padding(0.3)

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5))
            .selectAll('text')
            .style('font-family', 'Inter')
            .style('font-size', '10px')
            .style('color', colors.textMuted)

        g.append('g')
            .call(d3.axisLeft(y).tickSize(0))
            .selectAll('text')
            .style('font-family', 'Inter')
            .style('font-size', '11px')
            .style('color', colors.textPrimary)

        g.select('.domain').remove()

        // Bars
        const bars = g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', d => y(d.name.substring(0, 20))!)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('fill', d => (d.count > 10 ? colors.accentSecondary : colors.accentPrimary))
            .attr('rx', 4)

        bars.transition()
            .duration(300)
            .delay((_d, i) => i * 50)
            .attr('width', d => x(d.count))
            .ease(d3.easeOutQuad)

        // Labels
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('y', d => y(d.name.substring(0, 20))! + y.bandwidth() / 2 + 4)
            .attr('x', d => x(d.count) + 5)
            .text(d => d.count)
            .style('font-family', 'Inter')
            .style('font-size', '12px')
            .style('font-weight', '600')
            .style('fill', colors.textPrimary)
            .style('opacity', 0)
            .transition()
            .duration(300)
            .delay((_d, i) => i * 50 + 200)
            .style('opacity', 1)

    }, [data])

    return (
        <Card className="bg-surface border-border">
            <CardHeader>
                <CardTitle className="text-base font-medium text-text-primary">Applications by Program</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                <svg ref={svgRef}></svg>
            </CardContent>
        </Card>
    )
}

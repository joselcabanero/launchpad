'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DonutData {
    label: string
    count: number
}

const colors = ['#FFA103', '#DE5533', '#BC2D29', '#450E14', '#F5EACE', '#6B5C4E']

export default function StageDonut({ data }: { data: DonutData[] }) {
    const svgRef = useRef<SVGSVGElement>(null)

    useEffect(() => {
        if (!svgRef.current || !data.length) return

        const width = 250
        const height = 250
        const radius = Math.min(width, height) / 2
        const innerRadius = radius * 0.7

        const svg = d3.select(svgRef.current)
        svg.selectAll('*').remove()

        const g = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`)

        const pie = d3.pie<DonutData>()
            .value(d => d.count)
            .sort(null)

        const arc = d3.arc<d3.PieArcDatum<DonutData>>()
            .innerRadius(innerRadius)
            .outerRadius(radius)

        const total = data.reduce((acc, curr) => acc + curr.count, 0)

        // Arcs
        const path = g.selectAll('path')
            .data(pie(data))
            .enter()
            .append('path')
            .attr('fill', (_d, i) => colors[i % colors.length])
            .attr('d', arc)

        path.transition()
            .duration(400)
            .attrTween('d', (d) => {
                const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d)
                return (t) => arc(i(t))!
            })

        // Center label
        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.5em')
            .text('Total')
            .style('font-family', 'Inter')
            .style('font-size', '12px')
            .style('fill', '#6B5C4E')

        g.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.6em')
            .text(total)
            .style('font-family', 'Inter')
            .style('font-size', '28px')
            .style('font-weight', '700')
            .style('fill', '#1E1E1E')

    }, [data])

    return (
        <Card className="bg-surface border-border">
            <CardHeader>
                <CardTitle className="text-base font-medium text-text-primary">Companies by Stage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <svg ref={svgRef}></svg>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
                    {data.map((item, i) => (
                        <div key={item.label} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: colors[i % colors.length] }}
                            />
                            <span className="text-[11px] text-text-muted">{item.label}</span>
                            <span className="text-[11px] font-bold text-text-primary ml-auto tabular-nums">{item.count}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

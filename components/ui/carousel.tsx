"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CarouselProps = {
  className?: string
  children: React.ReactNode
}

export function Carousel({ className, children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false })

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-3">{children}</div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Précédent">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Suivant">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function CarouselItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full pl-3 md:basis-1/2", className)}>{children}</div>
}


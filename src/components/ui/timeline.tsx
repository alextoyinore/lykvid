import * as React from "react"
import * as TimelinePrimitive from "@radix-ui/react-timeline"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Root
    className={cn("relative", className)}
    ref={ref}
    {...props}
  />
))
Timeline.displayName = TimelinePrimitive.Root.displayName

const TimelineItem = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Item>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Item
    className={cn(
      "group relative flex cursor-pointer flex-col space-y-2",
      className
    )}
    ref={ref}
    {...props}
  />
))
TimelineItem.displayName = TimelinePrimitive.Item.displayName

const TimelineLine = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Line>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Line>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Line
    className={cn("absolute left-0 top-0 h-full w-px bg-muted", className)}
    ref={ref}
    {...props}
  />
))
TimelineLine.displayName = TimelinePrimitive.Line.displayName

const TimelineProgress = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Progress>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Progress>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Progress
    className={cn(
      "absolute left-0 top-0 h-full w-px bg-primary",
      className
    )}
    ref={ref}
    {...props}
  />
))
TimelineProgress.displayName = TimelinePrimitive.Progress.displayName

const TimelineCursor = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Cursor>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Cursor>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Cursor
    className={cn(
      "absolute left-0 top-0 h-full w-px bg-primary/50",
      className
    )}
    ref={ref}
    {...props}
  />
))
TimelineCursor.displayName = TimelinePrimitive.Cursor.displayName

const TimelineMarker = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Marker>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Marker>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Marker
    className={cn("absolute left-0 top-0 h-2 w-2 rounded-full bg-primary", className)}
    ref={ref}
    {...props}
  />
))
TimelineMarker.displayName = TimelinePrimitive.Marker.displayName

const TimelineContent = React.forwardRef<
  React.ElementRef<typeof TimelinePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TimelinePrimitive.Content>
>(({ className, ...props }, ref) => (
  <TimelinePrimitive.Content
    className={cn(
      "flex flex-col space-y-2 pl-4",
      className
    )}
    ref={ref}
    {...props}
  />
))
TimelineContent.displayName = TimelinePrimitive.Content.displayName

export {
  Timeline,
  TimelineItem,
  TimelineLine,
  TimelineProgress,
  TimelineCursor,
  TimelineMarker,
  TimelineContent,
}

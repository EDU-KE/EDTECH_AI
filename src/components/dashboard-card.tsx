
import Link from "next/link"
import { type LucideIcon } from "lucide-react"
import React from "react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  description: string
  Icon: LucideIcon
  href: string;
}

export const DashboardCard = React.memo(function DashboardCard({
  title,
  description,
  Icon,
  href
}: DashboardCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm sm:text-base font-medium leading-tight">{title}</CardTitle>
          <Icon className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
})
DashboardCard.displayName = 'DashboardCard';

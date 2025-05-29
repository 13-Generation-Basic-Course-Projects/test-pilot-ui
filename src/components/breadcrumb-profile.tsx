import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { House } from "lucide-react"
export function BreadcrumbProfile() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/project"><House size={18}/></BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage>profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

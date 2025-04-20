"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock, FileCheck } from "lucide-react"

type Certificate = {
  id: string
  name: string
  issueDate: string
  expiryDate: string
  issuingAuthority: string
  status: string
}

type CertificatesListProps = {
  certificates: Certificate[]
}

export function CertificatesList({ certificates }: CertificatesListProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "valid":
        return "bg-green-500"
      case "expiring soon":
        return "bg-amber-500"
      case "expired":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Sort certificates by status (expired first, then expiring soon, then valid)
  // and then by days until expiry
  const sortedCertificates = [...certificates].sort((a, b) => {
    const statusOrder = { expired: 0, "expiring soon": 1, valid: 2 }
    const aOrder = statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] || 3
    const bOrder = statusOrder[b.status.toLowerCase() as keyof typeof statusOrder] || 3

    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }

    return getDaysUntilExpiry(a.expiryDate) - getDaysUntilExpiry(b.expiryDate)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCheck className="h-5 w-5 mr-2" />
          Certificates & Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate</TableHead>
              <TableHead>Issuing Authority</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Days Remaining</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCertificates.map((certificate) => {
              const daysRemaining = getDaysUntilExpiry(certificate.expiryDate)

              return (
                <TableRow key={certificate.id}>
                  <TableCell className="font-medium">{certificate.name}</TableCell>
                  <TableCell>{certificate.issuingAuthority}</TableCell>
                  <TableCell>{new Date(certificate.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(certificate.expiryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(certificate.status)}>
                      {certificate.status === "Valid" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : certificate.status === "Expiring Soon" ? (
                        <Clock className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      )}
                      {certificate.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {daysRemaining <= 0 ? (
                      <span className="text-red-500 font-medium">Expired</span>
                    ) : daysRemaining <= 30 ? (
                      <span className="text-amber-500 font-medium">{daysRemaining} days</span>
                    ) : (
                      <span>{daysRemaining} days</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

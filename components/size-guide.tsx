"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Ruler } from "lucide-react"

interface SizeGuideProps {
  onClose: () => void
}

export function SizeGuide({ onClose }: SizeGuideProps) {
  const sizeChart = [
    { size: "S", chest: "88-96", waist: "76-84", length: "68" },
    { size: "M", chest: "96-104", waist: "84-92", length: "70" },
    { size: "L", chest: "104-112", waist: "92-100", length: "72" },
    { size: "XL", chest: "112-120", waist: "100-108", length: "74" },
    { size: "XXL", chest: "120-128", waist: "108-116", length: "76" },
  ]

  const kidsSizeChart = [
    { size: "4-5Y", chest: "56-60", waist: "52-56", length: "42" },
    { size: "6-7Y", chest: "60-64", waist: "56-60", length: "46" },
    { size: "8-9Y", chest: "64-68", waist: "60-64", length: "50" },
    { size: "10-11Y", chest: "68-72", waist: "64-68", length: "54" },
    { size: "12-13Y", chest: "72-76", waist: "68-72", length: "58" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-red-600" />
            Size Guide
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* How to Measure */}
          <div>
            <h3 className="text-lg font-semibold mb-4">How to Measure</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <h4 className="font-medium mb-1">Chest</h4>
                <p className="text-sm text-gray-600">
                  Measure around the fullest part of your chest, keeping the tape horizontal
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <h4 className="font-medium mb-1">Waist</h4>
                <p className="text-sm text-gray-600">
                  Measure aroun your natural waistline, keeping the tape comfortably loose
                </p>
              </div>
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <h4 className="font-medium mb-1">Length</h4>
                <p className="text-sm text-gray-600">
                  Measure from the highest point of your shoulder to your desired length
                </p>
              </div>
            </div>
          </div>

          {/* Adult Size Chart */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Adult Sizes</h3>
              <Badge className="bg-blue-100 text-blue-800">All measurements in cm</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Size</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Chest (cm)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Waist (cm)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">{row.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.chest}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.waist}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kids Size Chart */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold">Kids Sizes</h3>
              <Badge className="bg-green-100 text-green-800">All measurements in cm</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Age</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Chest (cm)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Waist (cm)</th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-medium">Length (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {kidsSizeChart.map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">{row.size}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.chest}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.waist}</td>
                      <td className="border border-gray-300 px-4 py-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Fit Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Stadium Fit</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Designed for everyday wear with a relaxed, comfortable fit. Perfect for casual wear and showing your
                  support.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Relaxed fit through the body</li>
                  <li>• Comfortable for all-day wear</li>
                  <li>• True to size</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Player Fit</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Athletic cut designed for performance and movement. Closer to the body for a more tailored look.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Slim, athletic fit</li>
                  <li>• Designed for movement</li>
                  <li>• Consider sizing up for comfort</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Sizing Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• If you're between sizes, we recommend sizing up for a more comfortable fit</li>
              <li>• All jerseys are designed to be worn over base layers</li>
              <li>• For a looser fit, choose one size larger than your measurements suggest</li>
              <li>• Kids sizes run true to age, but check measurements for growing children</li>
            </ul>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-red-600 hover:bg-red-700">
              Got it, thanks!
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

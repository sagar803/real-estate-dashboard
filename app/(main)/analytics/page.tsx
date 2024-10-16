'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

// Placeholder data
const dailyUsage = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 150 },
  { name: 'Wed', users: 180 },
  { name: 'Thu', users: 190 },
  { name: 'Fri', users: 210 },
  { name: 'Sat', users: 170 },
  { name: 'Sun', users: 140 },
]

const topIntents = [
  { name: 'Product Inquiry', value: 400 },
  { name: 'Customer Support', value: 300 },
  { name: 'Order Status', value: 200 },
  { name: 'Returns', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Chatbot Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users</CardTitle>
            <CardDescription>Number of users interacting with the chatbot daily</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top User Intents</CardTitle>
            <CardDescription>Most common user intentions in conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topIntents}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {topIntents.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Overview of important chatbot performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1.2 min</p>
                <p className="text-sm text-muted-foreground">Avg. Response Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">4.5/5</p>
                <p className="text-sm text-muted-foreground">User Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest interactions with the chatbot</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>User #1234 asked about product returns</span>
                <span className="text-sm text-muted-foreground">2 min ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span>User #5678 inquired about order status</span>
                <span className="text-sm text-muted-foreground">5 min ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span>User #9101 requested customer support</span>
                <span className="text-sm text-muted-foreground">12 min ago</span>
              </li>
              <li className="flex justify-between items-center">
                <span>User #1122 asked about product features</span>
                <span className="text-sm text-muted-foreground">18 min ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import React from 'react';
import { Settings, MessageCircle, Link, CreditCard, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const SettingsPage = () => {
  return (
    <div className="container mx-auto p-6">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Chatbot Name</span>
                <input className="border rounded p-1" defaultValue="My Awesome Chatbot" />
              </div>
              <div className="flex items-center justify-between">
                <span>Language</span>
                <select className="border rounded p-1">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Active</span>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2" />
              Conversation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Store Conversations</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Retention Period</span>
                <select className="border rounded p-1">
                  <option>30 days</option>
                  <option>60 days</option>
                  <option>90 days</option>
                </select>
              </div>
              <Button variant="outline">
                Export Conversations
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Link className="mr-2" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Slack</span>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Discord</span>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Telegram</span>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2" />
              Billing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Current Plan</span>
                <span className="font-bold">Pro</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Next Billing Date</span>
                <span>July 1, 2023</span>
              </div>
              <Button variant="outline">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button className="w-full justify-between" variant="outline">
          Advanced Settings
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
import { Bell, Check, Clock, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const notifications = [
    {
      id: '1',
      title: 'New Project Assignment',
      message: 'You have been assigned as Project Manager for the E-commerce Platform Redesign project.',
      type: 'info',
      read: false,
      timestamp: '2024-01-16T10:30:00Z'
    },
    {
      id: '2',
      title: 'Resource Conflict Alert',
      message: 'Sarah Chen is double-booked between two active projects. Please review allocation.',
      type: 'warning',
      read: false,
      timestamp: '2024-01-16T09:15:00Z'
    },
    {
      id: '3',
      title: 'Ticket Update',
      message: 'Your hardware upgrade request has been approved and is now in progress.',
      type: 'success',
      read: true,
      timestamp: '2024-01-15T14:20:00Z'
    },
    {
      id: '4',
      title: 'Project Deadline Reminder',
      message: 'Mobile App Development project milestone is due in 3 days.',
      type: 'warning',
      read: false,
      timestamp: '2024-01-15T11:45:00Z'
    },
    {
      id: '5',
      title: 'New Team Member Added',
      message: 'Connor Smith has been added to your Systems Engineering team.',
      type: 'info',
      read: true,
      timestamp: '2024-01-14T16:30:00Z'
    },
    {
      id: '6',
      title: 'Budget Alert',
      message: 'Data Analytics Dashboard project is approaching 80% of allocated budget.',
      type: 'warning',
      read: true,
      timestamp: '2024-01-14T13:10:00Z'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            Stay updated with important alerts and messages
          </p>
        </div>

        {/* Actions */}
        <div className="mb-6 flex gap-4">
          <Button variant="outline">
            Mark All as Read
          </Button>
          <Button variant="outline">
            Clear All
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-300 hover:shadow-soft ${
                !notification.read 
                  ? 'border-l-4 border-l-primary bg-primary/5' 
                  : 'border-l-4 border-l-transparent'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className={`font-semibold ${
                        !notification.read ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(notification.timestamp)}
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`${
                      !notification.read ? 'text-foreground' : 'text-muted-foreground'
                    } leading-relaxed`}>
                      {notification.message}
                    </p>
                    
                    <div className="mt-4 flex gap-2">
                      {!notification.read && (
                        <Button size="sm" variant="outline">
                          Mark as Read
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No notifications
            </h3>
            <p className="text-muted-foreground">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {notifications.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Notifications</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {unreadCount}
              </div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {notifications.filter(n => n.type === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Alerts</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
import { useState } from 'react';
import { Search, UserPlus, Shield, Mail, MoreHorizontal } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';

const mockUsers = [
  { id: 'USR-001', name: 'John Admin', email: 'admin@example.com', dept: 'Administration', role: 'Admin', status: 'Active' },
  { id: 'USR-002', name: 'Sarah Staff', email: 'sarah@example.com', dept: 'Production', role: 'Staff', status: 'Active' },
  { id: 'USR-003', name: 'Mike Manager', email: 'mike@example.com', dept: 'Quality Control', role: 'Manager', status: 'Active' },
  { id: 'USR-004', name: 'Emily Wilson', email: 'emily@example.com', dept: 'Sales', role: 'Staff', status: 'Inactive' },
  { id: 'USR-005', name: 'Alex Brown', email: 'alex@example.com', dept: 'Inventory', role: 'Manager', status: 'Active' },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto">
      <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
        <div className="px-8 py-6 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
          <div>
            <h4 className="font-black text-xl tracking-tight">Access Management</h4>
            <p className="text-xs font-medium uppercase tracking-widest opacity-60 mt-1">Manage workshop staff roles & permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary opacity-60" />
              <Input 
                placeholder="Search staff or email..." 
                className="pl-9 rounded-xl border-border bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="rounded-xl h-10 w-10 p-0 text-primary bg-white border border-border hover:bg-secondary/20">
              <UserPlus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                <TableHead className="px-8 py-5 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">User ID</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Staff Profile</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Identifier</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Department</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Authority</TableHead>
                <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Status</TableHead>
                <TableHead className="px-8 text-right text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-background/50 transition-colors group border-b border-border/50 last:border-0">
                  <TableCell className="px-8 py-4 font-black text-xs text-primary">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center font-black text-[10px] text-white",
                        user.status === 'Active' ? "bg-primary" : "bg-muted-foreground"
                      )}>
                        {user.name[0]}
                      </div>
                      <span className="font-black text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-bold opacity-40">{user.dept}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-black text-[10px] uppercase tracking-widest text-primary/80">
                      <Shield className="h-3.5 w-3.5" />
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      user.status === 'Active' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

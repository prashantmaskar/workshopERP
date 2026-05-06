import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Trash2, 
  UserPlus 
} from 'lucide-react';
import { useCustomer } from '../../../../hooks/useCustomer';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../../components/ui/table';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Card, CardContent, CardHeader } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../../../../components/ui/dropdown-menu';

export default function CustomerListPage() {
  const navigate = useNavigate();
  const { items, loading, fetchCustomers, deleteCustomer } = useCustomer();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredItems = items.filter(item => 
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your client relationships and contact data.</p>
        </div>
        <Button onClick={() => navigate('/dashboard/modules/customer/new')} className="gap-2">
          <UserPlus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3 px-6 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search customers..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <span className="text-sm text-muted-foreground">
                Total: {filteredItems.length}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="pl-6">ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Reg. Date</TableHead>
                <TableHead className="pr-6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">Loading customers...</TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No customers found.</TableCell>
                </TableRow>
              ) : (
                filteredItems.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="pl-6 text-xs font-mono text-muted-foreground">{customer.id}</TableCell>
                    <TableCell className="font-semibold">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Mail className="h-3 w-3 text-primary" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3 w-3 text-primary" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span>{customer.city}, {customer.state}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{customer.date}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors cursor-pointer outline-none">
                          <MoreHorizontal className="h-4 w-4 text-primary" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/dashboard/modules/customer/${customer.id}/edit`)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => deleteCustomer(customer.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

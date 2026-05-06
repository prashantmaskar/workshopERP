import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { useCustomer } from '../../../../hooks/useCustomer';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../../components/ui/card';

const customerSchema = z.object({
  customerName: z.string().min(2, "Required, min 2 characters").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number (10-15 digits)"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid pincode (6 digits)"),
  address: z.string().min(5, "Required").max(500),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number").optional().or(z.literal('')),
  companyName: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCustomer, items, loading } = useCustomer();
  const isEdit = !!id;

  const existingData = isEdit ? items.find(item => item.id === id) : null;

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: existingData ? {
      customerName: existingData.name,
      email: existingData.email,
      phone: existingData.phone,
      city: existingData.city,
      state: existingData.state,
      pincode: existingData.pincode,
      address: existingData.address,
      gstNumber: existingData.gstNumber,
      companyName: existingData.companyName,
    } : {}
  });

  const onSubmit = async (data: CustomerFormValues) => {
    // Mapping back to what useCustomer expects if needed, or updating useCustomer hook too
    await createCustomer(data);
    navigate('/dashboard/modules/customer');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Edit Customer' : 'Add New Customer'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update details for ' + existingData?.name : 'Register a new manufacturing partner'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Fill in the contact and business details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input id="customerName" {...register('customerName')} className={errors.customerName ? "border-destructive" : ""} />
                {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input id="companyName" {...register('companyName')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} className={errors.email ? "border-destructive" : ""} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" {...register('phone')} className={errors.phone ? "border-destructive" : ""} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" {...register('gstNumber')} placeholder="e.g., 27AABCU1234F1Z1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Detailed Address *</Label>
              <Textarea id="address" {...register('address')} className={errors.address ? "border-destructive" : ""} />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" {...register('city')} className={errors.city ? "border-destructive" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" {...register('state')} className={errors.state ? "border-destructive" : ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input id="pincode" {...register('pincode')} className={errors.pincode ? "border-destructive" : ""} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-3 bg-secondary/10 p-6">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              {isEdit ? 'Update Customer' : 'Save Customer'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

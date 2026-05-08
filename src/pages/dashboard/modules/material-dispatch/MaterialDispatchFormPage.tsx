import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw,
  Truck
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { logisticsService } from '../../../../services/api';

import { useCustomer } from '../../../../hooks/useCustomer';

interface DispatchFormValues {
  dispatchNumber: string;
  dispatchType: 'Invoice' | 'Delivery';
  customerId: string;
  customerName: string;
  itemDescription: string;
  dispatchQuantity: number;
  dispatchDate: string;
  rate?: number;
  gstAmount?: number;
  transportMode: 'Road' | 'Rail' | 'Air' | 'Sea';
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  trackingNumber: string;
  specialInstructions: string;
  status: string;
}

const dispatchTypes = ['Invoice', 'Delivery'];
const transportModes = ['Road', 'Rail', 'Air', 'Sea'];

export default function MaterialDispatchFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inwardLots, setInwardLots] = useState<any[]>([]);
  const { fetchCustomers, items: customers } = useCustomer();

  const { register, handleSubmit, setValue, watch } = useForm<DispatchFormValues>({
    defaultValues: {
      dispatchNumber: `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      dispatchDate: new Date().toISOString().split('T')[0],
      transportMode: (localStorage.getItem('last_transportMode') as any) || 'Road',
      vehicleNumber: localStorage.getItem('last_vehicleNumber') || '',
      driverName: localStorage.getItem('last_driverName') || '',
      driverPhone: localStorage.getItem('last_driverPhone') || '',
      dispatchType: 'Invoice',
      status: 'Pending'
    }
  });

  React.useEffect(() => {
    fetchCustomers();
    logisticsService.getInward().then(res => setInwardLots(res.data)).catch(console.error);
  }, [fetchCustomers]);

  const watchedDispatchType = watch('dispatchType');
  const watchedCustomerId = watch('customerId');
  const watchedItemDesc = watch('itemDescription');

  // FIFO Suggestion
  const matchingLots = inwardLots.filter(lot => 
    lot.customerId === watchedCustomerId && 
    lot.partName?.toLowerCase().includes(watchedItemDesc?.toLowerCase())
  ).sort((a, b) => new Date(a.receivedDate).getTime() - new Date(b.receivedDate).getTime());

  const onSubmit = async (data: DispatchFormValues) => {
    try {
      setLoading(true);
      // Persist transport info
      localStorage.setItem('last_transportMode', data.transportMode);
      localStorage.setItem('last_vehicleNumber', data.vehicleNumber);
      localStorage.setItem('last_driverName', data.driverName);
      localStorage.setItem('last_driverPhone', data.driverPhone);

      const selectedCustomer = customers.find(c => c.id === data.customerId);
      const submissionData = { ...data, customerName: selectedCustomer?.name };
      
      await logisticsService.createDispatch(submissionData);
      navigate('/dashboard/modules/material-dispatch');
    } catch (error: any) {
      console.error('Failed to register dispatch:', error);
      alert('Failed to register Dispatch. Please check database connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 max-w-(--breakpoint-2xl) mx-auto pb-32">
      <div className="flex items-center gap-6">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="rounded-xl border-border bg-white text-primary hover:bg-secondary/20 h-12 w-12"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Material Dispatch</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Configure outgoing shipments and delivery notes</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Dispatch Details</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Dispatch Number</Label>
                <Input {...register('dispatchNumber')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Dispatch Type</Label>
                <Select onValueChange={(val: any) => setValue('dispatchType', val)} defaultValue="Invoice">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {dispatchTypes.map(type => (
                      <SelectItem key={type} value={type} className="font-bold text-xs">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer</Label>
                <Select onValueChange={(val: any) => setValue('customerId', val)}>
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Customer" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id} className="font-bold text-xs">{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Dispatch Date</Label>
                <Input type="date" {...register('dispatchDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              {watchedDispatchType === 'Invoice' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Rate</Label>
                    <Input type="number" {...register('rate')} placeholder="Price per unit" className="h-12 rounded-xl border-border font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">GST Amount</Label>
                    <Input type="number" {...register('gstAmount')} placeholder="Tax amount" className="h-12 rounded-xl border-border font-bold" />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Item & Transport</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Item Description</Label>
                <Input {...register('itemDescription')} placeholder="e.g. Engine Valve" className="h-12 rounded-xl border-border font-bold" />
                {matchingLots.length > 0 && (
                  <div className="mt-2 p-3 bg-secondary/5 border border-dashed border-border rounded-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2 font-mono text-primary">FIFO Recommendation (Stock Lots)</p>
                    <div className="space-y-1">
                      {matchingLots.slice(0, 3).map((lot, i) => (
                        <div key={lot.id} className="text-[10px] font-bold flex justify-between">
                          <span>Lot: {lot.inwardNumber} ({new Date(lot.receivedDate).toLocaleDateString()})</span>
                          <span>Stock: {lot.receivedQuantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Dispatch Quantity</Label>
                <Input type="number" {...register('dispatchQuantity')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Transport Mode</Label>
                <Select onValueChange={(val: any) => setValue('transportMode', val)} defaultValue="Road">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Transport" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {transportModes.map(mode => (
                      <SelectItem key={mode} value={mode} className="font-bold text-xs">{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Vehicle Number</Label>
                <Input {...register('vehicleNumber')} placeholder="MH-12-XX-0000" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Driver Name</Label>
                <Input {...register('driverName')} placeholder="Driver's Name" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Driver Phone</Label>
                <Input {...register('driverPhone')} placeholder="10-digit number" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Tracking Number</Label>
                <Input {...register('trackingNumber')} placeholder="Courier/Internal LR Number" className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Dispatch Out</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Delivery Confirmation</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
               <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">Shipping Instructions</Label>
                <textarea 
                  {...register('specialInstructions')}
                  className="w-full bg-white/10 rounded-2xl p-4 text-xs font-bold border-0 focus:ring-2 focus:ring-white/20 h-32"
                  placeholder="Handle with care, urgent delivery, etc."
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Finalize Dispatch </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Discard Record
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

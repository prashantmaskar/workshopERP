import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calculator, 
  RefreshCw,
  X,
  ShoppingCart
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { purchaseOrderService } from '../../../../services/api';

interface POItem {
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  unit: string;
}

interface POFormValues {
  poNumber: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  lineItems: POItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  notes: string;
  paymentTerms: 'COD' | '15 Days' | '30 Days' | '45 Days' | 'Advance';
}

const suppliers = [
  { id: '1', name: 'Steel Suppliers Ltd' },
  { id: '2', name: 'Precision Tools Co.' },
  { id: '3', name: 'Hardware Solutions' },
];

const units = ['pcs', 'box', 'kg', 'meter', 'liter'];

export default function PurchaseOrderFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, watch, setValue } = useForm<POFormValues>({
    defaultValues: {
      poNumber: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      orderDate: new Date().toISOString().split('T')[0],
      lineItems: [{ itemCode: '', description: '', quantity: 0, unitPrice: 0, total: 0, unit: 'pcs' }],
      paymentTerms: '30 Days'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems"
  });

  const watchedItems = watch('lineItems');
  const subTotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = subTotal * 0.18;
  const finalTotal = subTotal + taxAmount;

  const onSubmit = async (data: POFormValues) => {
    try {
      setLoading(true);
      const selectedSupplier = suppliers.find(s => s.id === data.supplierId);
      const submissionData = {
        ...data,
        supplierName: selectedSupplier?.name,
        subtotal: subTotal,
        tax: taxAmount,
        totalAmount: finalTotal
      };
      
      await purchaseOrderService.create(submissionData);
      navigate('/dashboard/modules/purchase-order');
    } catch (error: any) {
      console.error('Failed to create PO:', error);
      alert('Failed to create Purchase Order. Please ensure database is connected and try again.');
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Create Purchase Order</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Issue a new procurement request to vendors</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Order Metadata</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">PO Number</Label>
                <Input {...register('poNumber')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Supplier Partner</Label>
                <Select onValueChange={(val: any) => setValue('supplierId', val)}>
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Supplier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {suppliers.map(s => (
                      <SelectItem key={s.id} value={s.id} className="font-bold text-xs">{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Order Date</Label>
                <Input type="date" {...register('orderDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Expected Delivery</Label>
                <Input type="date" {...register('expectedDeliveryDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Payment Terms</Label>
                <Select onValueChange={(val: any) => setValue('paymentTerms', val)} defaultValue="30 Days">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Terms" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {['COD', '15 Days', '30 Days', '45 Days', 'Advance'].map(term => (
                      <SelectItem key={term} value={term} className="font-bold text-xs">{term}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Notes</Label>
                <Input {...register('notes')} placeholder="Special instructions..." className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 flex items-center justify-between border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Line Items</h4>
              <Button type="button" size="sm" variant="outline" onClick={() => append({ itemCode: '', description: '', quantity: 0, unitPrice: 0, total: 0, unit: 'pcs' })} className="rounded-lg h-8 px-4 border-primary text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5">
                <Plus className="h-3 w-3 mr-2" /> Add Item
              </Button>
            </div>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/5 hover:bg-secondary/5 border-b border-border">
                    <TableHead className="px-8 py-4 text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Code / Desc</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Qty / Unit</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Unit Price</TableHead>
                    <TableHead className="text-[10px] uppercase font-black text-foreground/40 tracking-[0.2em]">Amount</TableHead>
                    <TableHead className="px-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id} className="border-b border-border last:border-0">
                      <TableCell className="px-8 py-4 space-y-2">
                        <Input {...register(`lineItems.${index}.itemCode` as const)} placeholder="SKU..." className="h-8 rounded-lg font-bold text-[10px]" />
                        <Input {...register(`lineItems.${index}.description` as const)} placeholder="Item description..." className="h-10 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell className="space-y-2">
                        <Input type="number" {...register(`lineItems.${index}.quantity` as const)} className="h-10 w-24 rounded-lg font-bold text-xs" />
                        <Select onValueChange={(val: any) => setValue(`lineItems.${index}.unit`, val)} defaultValue="pcs">
                          <SelectTrigger className="h-8 w-24 rounded-lg border-border font-bold text-[10px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map(u => (
                              <SelectItem key={u} value={u} className="text-[10px] font-bold">{u}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input type="number" {...register(`lineItems.${index}.unitPrice` as const)} className="h-10 w-24 rounded-lg font-bold text-xs" />
                      </TableCell>
                      <TableCell className="font-black text-xs">
                        ₹{(watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)}
                      </TableCell>
                      <TableCell className="px-8">
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Purchase Summary</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Financial Breakdown</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Subtotal</span>
                <span className="font-black">₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Est. Tax (GST 18%)</span>
                <span className="font-black">₹{taxAmount.toFixed(2)}</span>
              </div>
              
              <div className="pt-8 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Grand Total Value</p>
                <h2 className="text-5xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</h2>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Commit PO </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Discard Changes
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

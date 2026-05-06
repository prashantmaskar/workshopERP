import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw,
  PackageCheck
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { logisticsService } from '../../../../services/api';

interface InwardFormValues {
  inwardNumber: string;
  poNumber: string;
  receivedDate: string;
  receivedQuantity: number;
  warehouseLocation: 'Main' | 'Secondary' | 'Vault' | 'Staging';
  qcRemarks: string;
  qcStatus: 'Pass' | 'Fail' | 'On Hold';
  receivedBy: string;
  qcInspectedBy: string;
}

const warehouseLocations = ['Main', 'Secondary', 'Vault', 'Staging'];
const qcStatuses = ['Pass', 'Fail', 'On Hold'];

export default function MaterialInwardFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue } = useForm<InwardFormValues>({
    defaultValues: {
      inwardNumber: `INW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      receivedDate: new Date().toISOString().split('T')[0],
      qcStatus: 'Pass',
      warehouseLocation: 'Main'
    }
  });

  const onSubmit = async (data: InwardFormValues) => {
    try {
      setLoading(true);
      await logisticsService.createInward(data);
      navigate('/dashboard/modules/material-inward');
    } catch (error: any) {
      console.error('Failed to register inward:', error);
      alert('Failed to register Inward. Please check database connection.');
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Material Inward (GRN)</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Record incoming materials and goods received</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">General Information</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Inward Number</Label>
                <Input {...register('inwardNumber')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">PO Number (Ref)</Label>
                <Input {...register('poNumber')} placeholder="PO-2024-1234" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Received Date</Label>
                <Input type="date" {...register('receivedDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Received Quantity</Label>
                <Input type="number" {...register('receivedQuantity')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Warehouse Location</Label>
                <Select onValueChange={(val: any) => setValue('warehouseLocation', val)} defaultValue="Main">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {warehouseLocations.map(loc => (
                      <SelectItem key={loc} value={loc} className="font-bold text-xs">{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Received By</Label>
                <Input {...register('receivedBy')} placeholder="Name of receiver" className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Quality Control (QC)</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">QC Status</Label>
                <Select onValueChange={(val: any) => setValue('qcStatus', val)} defaultValue="Pass">
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {qcStatuses.map(status => (
                      <SelectItem key={status} value={status} className="font-bold text-xs">{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">QC Inspected By</Label>
                <Input {...register('qcInspectedBy')} placeholder="Name of inspector" className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">QC Remarks</Label>
                <textarea 
                  {...register('qcRemarks')}
                  className="w-full bg-secondary/5 rounded-2xl p-4 text-xs font-bold border border-border focus:ring-2 focus:ring-primary/20 h-32"
                  placeholder="Notes on material quality, shortages, etc."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <PackageCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Inward Receipt</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Inventory Update</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
               <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 text-white">General Remarks</Label>
                <textarea 
                  {...register('qcRemarks')}
                  className="w-full bg-white/10 rounded-2xl p-4 text-xs font-bold border-0 focus:ring-2 focus:ring-white/20 h-32"
                  placeholder="Notes on material quality, shortages, etc."
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Save GRN </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Cancel Record
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  RefreshCw,
  Target
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Card, CardContent, CardHeader, CardFooter, CardDescription, CardTitle } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';

import { financeService } from '../../../../services/api';

interface JobCostingFormValues {
  jobCode: string;
  jobDescription: string;
  startDate: string;
  endDate: string;
  department: string;
  resources: {
    laborHours: number;
    laborRate: number;
    laborCost: number;
    materialCost: number;
    overheadCost: number;
  };
  estimatedRevenue: number;
  calculations: {
    totalCost: number;
    profit: number;
    profitMargin: number;
  };
  status: string;
  notes: string;
}

const departments = [
  'Production',
  'Assembly',
  'Machining',
  'Quality Control',
  'Packaging',
];

export default function JobCostingFormPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<JobCostingFormValues>({
    defaultValues: {
      jobCode: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      startDate: new Date().toISOString().split('T')[0],
      resources: {
        laborHours: 0,
        laborRate: 0,
        laborCost: 0,
        materialCost: 0,
        overheadCost: 0
      },
      estimatedRevenue: 0,
      status: 'Open'
    }
  });

  const watchedResources = watch('resources');
  const watchedRevenue = watch('estimatedRevenue');

  const laborCost = (watchedResources.laborHours || 0) * (watchedResources.laborRate || 0);
  const totalCost = laborCost + (Number(watchedResources.materialCost) || 0) + (Number(watchedResources.overheadCost) || 0);
  const profit = watchedRevenue - totalCost;
  const profitMargin = watchedRevenue > 0 ? (profit / watchedRevenue) * 100 : 0;

  const onSubmit = async (data: JobCostingFormValues) => {
    try {
      setLoading(true);
      const submissionData = {
        ...data,
        resources: {
          ...data.resources,
          laborCost: laborCost
        },
        calculations: {
          totalCost,
          profit,
          profitMargin
        }
      };
      
      await financeService.createJobCosting(submissionData);
      navigate('/dashboard/modules/job-costing');
    } catch (error: any) {
      console.error('Failed to save job costing:', error);
      alert('Failed to save Job Costing. Please ensure database is connected.');
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
          <h1 className="text-4xl font-black tracking-tighter text-foreground">Job Cost Analysis</h1>
          <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-60 mt-1">Detailed cost estimation for specific manufacturing jobs</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Job Metadata</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Job Code</Label>
                <Input {...register('jobCode')} readOnly className="bg-secondary/20 font-black text-xs h-12 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Department</Label>
                <Select onValueChange={(val: any) => setValue('department', val)}>
                  <SelectTrigger className="h-12 rounded-xl border-border font-bold">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    {departments.map(d => (
                      <SelectItem key={d} value={d} className="font-bold text-xs">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Job Description</Label>
                <Input {...register('jobDescription')} placeholder="Detailed job description..." className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Start Date</Label>
                <Input type="date" {...register('startDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">End Date</Label>
                <Input type="date" {...register('endDate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border bg-white shadow-sm border overflow-hidden">
            <div className="px-8 py-4 bg-secondary/10 border-b border-border">
              <h4 className="font-black text-sm uppercase tracking-widest opacity-60">Resource Costs</h4>
            </div>
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Labor Hours</Label>
                <Input type="number" {...register('resources.laborHours')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Labor Rate (₹/hr)</Label>
                <Input type="number" {...register('resources.laborRate')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Material Cost (₹)</Label>
                <Input type="number" {...register('resources.materialCost')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Overhead Cost (₹)</Label>
                <Input type="number" {...register('resources.overheadCost')} className="h-12 rounded-xl border-border font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Revenue (₹)</Label>
                <Input type="number" {...register('estimatedRevenue')} placeholder="Expected client billing..." className="h-12 rounded-xl border-border font-bold" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-0 shadow-lg rounded-[2.5rem] p-4 sticky top-24">
            <CardHeader className="pt-8 px-6">
              <div className="p-3 bg-white/20 w-fit rounded-2xl mb-4">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Profitability</CardTitle>
              <CardDescription className="text-primary-foreground/60 text-xs font-bold uppercase tracking-widest">Job Costing Summary</CardDescription>
            </CardHeader>
            <CardContent className="px-6 space-y-4 pt-4">
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Total Cost</span>
                <span className="font-black">₹{totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/10 p-3 rounded-2xl">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Profit</span>
                <span className={`font-black ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>₹{profit.toFixed(2)}</span>
              </div>
              <div className="relative pt-8 pb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-2">Profit Margin</p>
                <h2 className="text-5xl font-black tracking-tighter">{profitMargin.toFixed(1)}%</h2>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-8">
              <Button type="submit" className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase tracking-widest hover:bg-white/90 shadow-xl" disabled={loading}>
                {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <> <Save className="h-5 w-5 mr-3" /> Save Analysis </>}
              </Button>
              <Button type="button" variant="ghost" className="w-full text-white/60 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest text-[10px]" onClick={() => navigate(-1)}>
                Discard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

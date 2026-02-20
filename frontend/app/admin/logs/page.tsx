'use client';

import React, { useState } from 'react';
import {
    Activity,
    Search,
    Calendar,
    Download,
    Filter,
    User,
    Edit3,
    ShieldAlert,
    LogIn,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    Database,
    Clock,
    UserPlus,
    XCircle,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminLogsPage() {
    const [search, setSearch] = useState('');

    const logs = [
        { id: '1', type: 'AUTH', action: 'Connexion Admin', user: 'Admin Principal', ip: '197.156.xx.xx', date: '08/01/2026 18:45', status: 'SUCCESS', icon: LogIn, color: 'text-green-500', bg: 'bg-green-500/10' },
        { id: '2', type: 'UPDATE', action: 'Modif Catégorie (Véhicules)', user: 'Samuel E.', ip: '197.156.xx.xx', date: '08/01/2026 17:30', status: 'SUCCESS', icon: Edit3, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: '3', type: 'DELETE', action: 'Suppression Annonce #4521', user: 'Modérateur 1', ip: '41.202.xx.xx', date: '08/01/2026 16:15', status: 'COMPLETED', icon: Trash2, color: 'text-red-500', bg: 'bg-red-500/10' },
        { id: '4', type: 'SYSTEM', action: 'Backup BDD automatique', user: 'SYSTEM', ip: '127.0.0.1', date: '08/01/2026 03:00', status: 'SUCCESS', icon: Database, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: '5', type: 'SECURITY', action: 'Tentative Brute Force', user: 'Inconnu', ip: '192.168.xx.xx', date: '07/01/2026 23:10', status: 'BLOCKED', icon: ShieldAlert, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { id: '6', type: 'USER', action: 'Nouveau compte créé', user: 'Moussa D.', ip: '197.156.xx.xx', date: '07/01/2026 19:40', status: 'SUCCESS', icon: UserPlus, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="space-y-10">
            {/* Header / Global Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black font-outfit tracking-tight">Logs d'Activité</h1>
                    <p className="text-slate-500 font-medium mt-1">Audit complet de tous les événements système et admin.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl border-2 border-red-500/10 text-red-500 hover:bg-red-50 font-black gap-2">
                        <Trash2 className="size-5" /> Purger les logs
                    </Button>
                    <Button className="h-14 px-10 rounded-2xl font-black gap-2 shadow-xl shadow-primary/20">
                        <Download className="size-5" /> Exporter PDF/CSV
                    </Button>
                </div>
            </div>

            {/* Quick Filters Row */}
            <Card className="border-none shadow-xl bg-white dark:bg-slate-900 rounded-[2.5rem] p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Chercher une action, un user ..."
                            className="h-14 pl-12 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select defaultValue="all">
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold">
                            <Filter className="size-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Type d'action" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2">
                            <SelectItem value="all" className="rounded-xl font-bold">Tous les types</SelectItem>
                            <SelectItem value="auth" className="rounded-xl font-bold">Authentification</SelectItem>
                            <SelectItem value="crud" className="rounded-xl font-bold">Modifications</SelectItem>
                            <SelectItem value="security" className="rounded-xl font-bold">Sécurité</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="30d">
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-none font-bold">
                            <Calendar className="size-4 mr-2 text-slate-400" />
                            <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl p-2">
                            <SelectItem value="24h" className="rounded-xl font-bold">Dernières 24h</SelectItem>
                            <SelectItem value="7d" className="rounded-xl font-bold">7 derniers jours</SelectItem>
                            <SelectItem value="30d" className="rounded-xl font-bold">30 derniers jours</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="ghost" className="h-14 rounded-2xl font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
                        Réinitialiser
                    </Button>
                </div>
            </Card>

            {/* Logs Table */}
            <Card className="border-none shadow-2xl bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50 dark:bg-white/5">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="h-20 px-10 font-black uppercase tracking-widest text-[10px] text-slate-400">Événement & Type</TableHead>
                            <TableHead className="h-20 px-10 font-black uppercase tracking-widest text-[10px] text-slate-400">Utilisateur</TableHead>
                            <TableHead className="h-20 px-10 font-black uppercase tracking-widest text-[10px] text-slate-400">Adresse IP</TableHead>
                            <TableHead className="h-20 px-10 font-black uppercase tracking-widest text-[10px] text-slate-400">Date & Heure</TableHead>
                            <TableHead className="h-20 px-10 font-black uppercase tracking-widest text-[10px] text-slate-400">Résultat</TableHead>
                            <TableHead className="h-20 px-10 text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 border-slate-100 dark:border-white/5 transition-colors group">
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl ${log.bg} flex items-center justify-center shrink-0`}>
                                            <log.icon className={`size-6 ${log.color}`} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 dark:text-white leading-none mb-2">{log.action}</p>
                                            <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-[0.1em] border-slate-200 text-slate-400">
                                                {log.type}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black">
                                            {log.user.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{log.user}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8 font-mono text-xs text-slate-400 font-bold tracking-tight">
                                    {log.ip}
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-400">
                                        <Clock className="size-4 opacity-40" />
                                        {log.date}
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8">
                                    <div className="flex items-center gap-2">
                                        {log.status === 'SUCCESS' || log.status === 'COMPLETED' ? (
                                            <CheckCircle2 className="size-4 text-green-500" />
                                        ) : log.status === 'BLOCKED' ? (
                                            <XCircle className="size-4 text-red-500" />
                                        ) : (
                                            <Clock className="size-4 text-orange-500" />
                                        )}
                                        <span className={cn(
                                            "text-xs font-black uppercase tracking-widest",
                                            log.status === 'SUCCESS' || log.status === 'COMPLETED' ? "text-green-600" :
                                                log.status === 'BLOCKED' ? "text-red-600" : "text-orange-600"
                                        )}>
                                            {log.status}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-10 py-8 text-right">
                                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Eye className="size-5" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Placeholder */}
                <div className="p-10 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-400">Affichage de 1-10 sur 452 événements</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-xl size-10 border-gray-100 dark:border-white/5 disabled:opacity-30" disabled>
                            <ChevronLeft className="size-5" />
                        </Button>
                        <Button variant="default" className="rounded-xl size-10 font-black">1</Button>
                        <Button variant="ghost" className="rounded-xl size-10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 underline decoration-primary decoration-4 underline-offset-8">2</Button>
                        <Button variant="ghost" className="rounded-xl size-10 font-bold hover:bg-slate-50 dark:hover:bg-white/5">3</Button>
                        <Button variant="outline" size="icon" className="rounded-xl size-10 border-gray-100 dark:border-white/5">
                            <ChevronRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

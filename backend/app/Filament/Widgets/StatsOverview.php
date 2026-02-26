<?php

namespace App\Filament\Widgets;

use App\Models\Listing;
use App\Models\User;
use App\Models\Report;
use App\Models\Boost;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Annonces', Listing::count())
                ->description('Annonces publiées sur la plateforme')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('success'),
            Stat::make('Membres', User::count())
                ->description('Utilisateurs inscrits')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),
            Stat::make('Signalements', Report::where('status', 'PENDING')->count())
                ->description('En attente de traitement')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('danger'),
            Stat::make('Boosts Actifs', Boost::where('is_active', true)->count())
                ->description('Annonces mises en avant')
                ->descriptionIcon('heroicon-m-rocket-launch')
                ->color('warning'),
        ];
    }
}

<?php

namespace App\Filament\Widgets;

use App\Models\Listing;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class ListingsChart extends ChartWidget
{
    protected static ?string $heading = 'Annonces par mois';
    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = Listing::selectRaw("COUNT(*) as count, strftime('%m', created_at) as month")
            ->whereRaw("strftime('%Y', created_at) = ?", [date('Y')])
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $counts = array_fill(1, 12, 0);
        foreach ($data as $row) {
            $counts[$row->month] = $row->count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Annonces publiées',
                    'data' => array_values($counts),
                    'backgroundColor' => '#f59e0b',
                    'borderColor' => '#f59e0b',
                ],
            ],
            'labels' => ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

<?php

namespace App\Filament\Widgets;

use App\Models\Listing;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestListings extends BaseWidget
{
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Dernières Annonces';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Listing::latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')->label('Titre'),
                Tables\Columns\TextColumn::make('user.email')->label('Vendeur'),
                Tables\Columns\TextColumn::make('price')->money('XAF')->label('Prix'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'DRAFT',
                        'success' => 'ACTIVE',
                        'danger' => 'SOLD',
                    ])->label('Statut'),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->label('Date'),
            ]);
    }
}

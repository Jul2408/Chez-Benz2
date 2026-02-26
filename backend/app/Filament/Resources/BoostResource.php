<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BoostResource\Pages;
use App\Models\Boost;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BoostResource extends Resource
{
    protected static ?string $model = Boost::class;

    protected static ?string $navigationIcon = 'heroicon-o-rocket-launch';
    
    protected static ?string $navigationGroup = 'Gestion des Annonces';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('listing_id')
                    ->relationship('listing', 'title')
                    ->searchable()
                    ->required(),
                Forms\Components\Select::make('type')
                    ->options([
                        'URGENT' => 'Urgent',
                        'FEATURED' => 'Mis en avant',
                        'TOP' => 'Haut de page',
                    ])
                    ->required(),
                Forms\Components\DateTimePicker::make('starts_at')
                    ->required(),
                Forms\Components\DateTimePicker::make('ends_at')
                    ->required(),
                Forms\Components\Toggle::make('is_active')
                    ->default(true),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('listing.title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('type')
                    ->colors([
                        'danger' => 'URGENT',
                        'success' => 'FEATURED',
                        'warning' => 'TOP',
                    ]),
                Tables\Columns\TextColumn::make('starts_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('ends_at')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'URGENT' => 'Urgent',
                        'FEATURED' => 'Mis en avant',
                        'TOP' => 'Haut de page',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageBoosts::route('/'),
        ];
    }
}

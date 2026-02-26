<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReportResource\Pages;
use App\Models\Report;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReportResource extends Resource
{
    protected static ?string $model = Report::class;

    protected static ?string $navigationIcon = 'heroicon-o-exclamation-triangle';
    
    protected static ?string $navigationGroup = 'Administration';

    protected static ?string $label = 'Signalement';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'email')
                    ->required()
                    ->searchable(),
                Forms\Components\Select::make('listing_id')
                    ->relationship('listing', 'title')
                    ->searchable(),
                Forms\Components\Select::make('reason')
                    ->options([
                        'SPAM' => 'Spam / Publicité',
                        'ARNAQUE' => 'Arnaque suspectée',
                        'CONTENU_INAPPROPRIE' => 'Contenu inapproprié',
                        'AUTRE' => 'Autre',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('description')
                    ->columnSpanFull(),
                Forms\Components\Select::make('status')
                    ->options([
                        'PENDING' => 'En attente',
                        'RESOLVED' => 'Résolu',
                        'DISMISSED' => 'Rejeté',
                    ])
                    ->default('PENDING')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Signaleur')
                    ->sortable(),
                Tables\Columns\TextColumn::make('listing.title')
                    ->label('Annonce')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('reason')
                    ->colors([
                        'warning' => 'SPAM',
                        'danger' => 'ARNAQUE',
                        'info' => 'CONTENU_INAPPROPRIE',
                        'secondary' => 'AUTRE',
                    ]),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'PENDING',
                        'success' => 'RESOLVED',
                        'danger' => 'DISMISSED',
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'PENDING' => 'En attente',
                        'RESOLVED' => 'Résolu',
                        'DISMISSED' => 'Rejeté',
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
            'index' => Pages\ManageReports::route('/'),
        ];
    }
}

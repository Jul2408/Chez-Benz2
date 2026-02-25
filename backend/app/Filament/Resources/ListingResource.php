<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ListingResource\Pages;
use App\Models\Listing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Gestion des Annonces';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informations de base')
                    ->description('Détails principaux de l\'annonce')
                    ->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Forms\Set $set, ?string $state) => $set('slug', \Illuminate\Support\Str::slug($state))),
                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(Listing::class, 'slug', ignoreRecord: true),
                        Forms\Components\Select::make('user_id')
                            ->relationship('user', 'email')
                            ->required()
                            ->searchable(),
                        Forms\Components\Select::make('category_id')
                            ->relationship('category', 'name')
                            ->searchable(),
                        Forms\Components\Textarea::make('description')
                            ->required()
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Prix et Localisation')
                    ->schema([
                        Forms\Components\TextInput::make('price')
                            ->required()
                            ->numeric()
                            ->suffix('XAF'),
                        Forms\Components\TextInput::make('city')
                            ->required(),
                        Forms\Components\TextInput::make('region')
                            ->required(),
                    ])->columns(3),

                Forms\Components\Section::make('Paramètres')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'DRAFT' => 'Brouillon',
                                'ACTIVE' => 'Actif',
                                'SOLD' => 'Vendu',
                                'ARCHIVED' => 'Archivé',
                            ])
                            ->required()
                            ->default('ACTIVE'),
                        Forms\Components\Select::make('condition')
                            ->options([
                                'NEUF' => 'Neuf',
                                'OCCASION' => 'Occasion',
                                'RECONDITIONNE' => 'Reconditionné',
                            ])
                            ->required()
                            ->default('OCCASION'),
                        Forms\Components\Toggle::make('is_negotiable')
                            ->default(true),
                        Forms\Components\Toggle::make('is_featured')
                            ->default(false),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.email')
                    ->label('Utilisateur')
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Catégorie')
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->money('XAF')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'DRAFT',
                        'success' => 'ACTIVE',
                        'danger' => 'SOLD',
                        'secondary' => 'ARCHIVED',
                    ]),
                Tables\Columns\IconColumn::make('is_featured')
                    ->label('Mis en avant')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'DRAFT' => 'Brouillon',
                        'ACTIVE' => 'Actif',
                        'SOLD' => 'Vendu',
                        'ARCHIVED' => 'Archivé',
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListListings::route('/'),
            'create' => Pages\CreateListing::route('/create'),
            'edit' => Pages\EditListing::route('/{record}/edit'),
        ];
    }
}

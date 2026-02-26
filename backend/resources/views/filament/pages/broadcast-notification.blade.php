<x-filament-panels::page>
    <form wire:submit="send">
        {{ $this->form }}
        
        <div class="mt-6 flex justify-end">
            <x-filament::button type="submit" size="lg" class="bg-primary shadow-lg hover:scale-105 transition-transform">
                Envoyer à tous les membres
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>

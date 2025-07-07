class EcoPointController {
    constructor(
        public id: string,
        public title: string,
        public cnpj: string,
        public opening_hours: string,
        public interval: string,
        public accepted_materials: string[],
        public address: string,
        public coordinates: string
    ) {}
    
    static fromDTO(dto: { 
        id: string; 
        title: string; 
        cnpj: string; 
        opening_hours: string;
        interval: string;
        accepted_materials: string[];
        address: string;
        coordinates: string;
    }): EcoPointController {
        return new EcoPointController(
            dto.id,
            dto.title,
            dto.cnpj,
            dto.opening_hours,
            dto.interval,
            dto.accepted_materials,
            dto.address,
            dto.coordinates
        );
    }
    
    toDTO(): { 
        id: string; 
        title: string; 
        cnpj: string; 
        opening_hours: string;
        interval: string;
        accepted_materials: string[];
        address: string;
        coordinates: string;
    } {
        return {
            id: this.id,
            title: this.title,
            cnpj: this.cnpj,
            opening_hours: this.opening_hours,
            interval: this.interval,
            accepted_materials: this.accepted_materials,
            address: this.address,
            coordinates: this.coordinates
        };
    }
}

export { EcoPointController };

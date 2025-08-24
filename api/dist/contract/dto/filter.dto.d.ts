import { PaginationDto } from 'src/commom/dto/pagination.dto';
export declare class FilterDto extends PaginationDto {
    status?: 'ativo' | 'cancelado' | 'finalizado';
    nomeCliente?: string;
    documentoCliente?: string;
    placa?: string;
    renavam?: string;
    dataInicio?: number;
    dataFim?: number;
}

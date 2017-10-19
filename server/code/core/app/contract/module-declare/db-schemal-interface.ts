export interface DbSchemalInterface {
    install();
    
    up();
    
    down();
}
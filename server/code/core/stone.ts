export class Stone {
    private static $instance: Stone;
    private static $services = {};
    
    static getInstance(): Stone {
        if (!Stone.$instance) {
            Stone.$instance = new Stone();
        }
        
        return Stone.$instance;
    }
    
    bootstrap() {
        Stone.getInstance().s('$stoneModuleManager').boot();
    }
    
    singleton(id: string, o: Object): Stone {
        Stone.$services[id] = o;
        
        return this;
    }
    
    s(id: string): any {
        if (!Stone.$services.hasOwnProperty(id)) {
            throw new Meteor.Error("app", "Service has not initialized")
        }
        
        return Stone.$services[id];
    }
}
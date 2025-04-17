import colors from "ansi-colors";

export const printBanner = () => {
    console.log(colors.blue(`
        _   _  ____    _____  _       _____ 
        | \\ | ||  _ \\  / ____|| |     |_   _|
        |  \\| || |_) || |     | |       | |  
        | . \` ||  _ < | |     | |       | |  
        | |\\  || |_) || |____ | |____  _| |_ 
        |_| \\_||____/  \\_____||______||_____|    
    `));
}; 
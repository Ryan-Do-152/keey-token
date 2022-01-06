const Menu = (props) => {
    return (
        <div className="bg-gray-200">
            <nav className="flex items-center justify-between flex-wrap p-6 container mx-auto">

                <div className='flex items-center flex-shrink text-indigo-400 mr-6'>
                    <a href="/">
                        <h1 className='text-3xl font-bold'>
                            KEEY Token!
                        </h1>
                    </a>
                </div>
                <div>

                </div>
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-lg lg:flex-grow">
                        <a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-slate-600 hover:text-slate-900 hover:underline mr-4">Home</a>
                        <a href="/buy-token" className="block mt-4 lg:inline-block lg:mt-0 text-slate-600 hover:text-slate-900 hover:underline mr-4">Buy Token</a>
                        <a href="/my-token" className="block mt-4 lg:inline-block lg:mt-0 text-slate-600 hover:text-slate-900 hover:underline mr-4">My Token</a>
                    </div>
                    
                    <div>
                        {console.log(props.account)}
                        
                        <button 
                            onClick={props.connetButton} 
                            className="inline-block w-full items-center justify-center px-4 py-2 border border-transpartent rounded-md text-base font-medium text-white bg-indigo-400 hover:bg-indigo-500">
                                {props.account === undefined || props.account.addressCompact === null ? 'Connet Wallet' : 'Address: '+ props.account.addressCompact}

                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}


export default Menu;
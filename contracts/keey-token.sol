pragma solidity >=0.6.0 <0.9.0;

import './USDT.sol';

interface ERC20Interface {
    function transfer(address to, uint tokens) external returns (bool success);
    function transferFrom(address from, address to, uint tokens) external returns (bool success);
    function balanceOf(address tokenOwner) external view returns (uint balance);
    function approve(address spender, uint tokens) external returns (bool success);
    function allowance(address tokenOwner, address spender) external view returns (uint remaining);
    function totalSupply() external view returns (uint);

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
}

contract KEEYToken is ERC20Interface {
    string public name;
    string public symbol;
    uint8 public decimals;
    uint public override totalSupply;
    mapping(address => uint) public balances;
    mapping(address => mapping(address => uint)) public allowed;
    
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint _totalSupply)
         {
            name = _name;
            symbol = _symbol;
            decimals = _decimals;
            totalSupply = _totalSupply;
            balances[msg.sender] = _totalSupply;
        }
        
    function transfer(address to, uint value) public override returns(bool) {
        require(balances[msg.sender] >= value,'KEEY in the Account is not enough!');
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function transferFrom(address from, address to, uint value) public override returns(bool) {
        uint allowance = allowed[from][msg.sender];
        require(balances[msg.sender] >= value && allowance >= value,'KEEY in the Account is not enough!');
        allowed[from][msg.sender] -= value;
        balances[msg.sender] -= value;
        balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }
    
    function approve(address spender, uint value) public override returns(bool) {
        require(spender != msg.sender);
        allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }
    
    function allowance(address owner, address spender) public override view returns(uint) {
        return allowed[owner][spender];
    }
    
    function balanceOf(address owner) public override view returns(uint) {
        return balances[owner];
    }
}

contract BuyKEEYTokens {

    struct Sale {
            address investor;
            uint quantity;
        }
    Sale[] public sales;
    mapping (address => uint256) public lastReceived;

    KEEYToken public token;
    USDT public usdt;

    address public admin;
    uint public price;
    uint public priceKeeyUSDT;

    event BuyTokens(address buyer, uint256 amount);

    constructor() {
        //create key token
        token = new KEEYToken("keey token", "KEEY", 0, 2500);

        usdt = new USDT(0x06a728975026e69a59c38C3FE61ae8c81769a317,50000 *(10 ** 18));

        admin = msg.sender;
        //price keey/eth là 1 eth
        price = 1 *(10 ** 18);
        //price keey/usdt là 10000
        priceKeeyUSDT = 10000 *(10 ** 18);
    }

    receive() external payable {}
    
    function buy()payable external {
        require(msg.value % price == 0, 'Have to send a multiple of price');

        uint quantity = msg.value / price;
        // quantily token buy > 0
        require(quantity > 0, "You need to buy at least some tokens");
        // quantily token in wallet and buy < 2
        require((token.balanceOf(msg.sender) + quantity) <= 2, "Wallet buys up to 2 KEEY");
        // last received time > 1 days
        require(block.timestamp - lastReceived[msg.sender] > 1 days,"Error: Just 01 tranfer per day for this address!!!");

        require(token.transfer(msg.sender, quantity));
        emit BuyTokens(msg.sender, quantity);
        
        updateLastReceived(msg.sender);
    }

    function buyKeeyUSDT(uint value) external {
        require(value % priceKeeyUSDT == 0, 'Have to send a multiple of price');

        uint quantity = value / priceKeeyUSDT;
        // quantily token buy > 0
        require(quantity > 0, "You need to buy at least some tokens");
        // quantity token in wallet and buy < 2
        require((token.balanceOf(msg.sender) + quantity) <= 2, "Wallet buys up to 2 KEEY");
        // last Received time > 1 days
        require(block.timestamp - lastReceived[msg.sender] > 1 days,"Error: Just 01 tranfer per day for this address!!!");
        //send usdt from buyer to contract address
        require(usdt.transferFrom(msg.sender, address(this), value),'transfer usdt false');

        //send keey token to buyer
        require(token.transfer(msg.sender, quantity),'transfer keey false');
        emit BuyTokens(msg.sender, quantity);
        updateLastReceived(msg.sender);
    }

    function balanceOf(address owner) public view returns(uint) {
        return token.balanceOf(owner);
    }
    
    function withdraw(address payable to,uint amount)external onlyAdmin(){
        to.transfer(amount);    
    }

    function getLastReceiced(address owner) public view returns(bool) {
        return (block.timestamp - lastReceived[owner]) > 0 ? false : true;
    }

    function updateLastReceived(address receiver) internal {
        lastReceived[receiver] = block.timestamp;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, 'only admin');
        _;
    }
    
}

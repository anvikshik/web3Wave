const main = async () =>{
    // const [deployer] = await hre.ethers.getSigners();
    // const accountBalance = await deployer.getBalance();

    // console.log("Deploying Contracts with address:", deployer.address);
    // console.log("Account Balance: ", accountBalance.toString());

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1")
    });

    await waveContract.deployed();

    console.log("WavePortal: ", waveContract.address);
}

const runMain= async ()=>{
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();
const main = async() => {
    // const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
      value:hre.ethers.utils.parseEther("0.1"),
    });

    await waveContract.deployed();

    console.log("Contract deployed to:", waveContract.address);
    // console.log("Contract deployed by:", owner.address);
    // const waveTxn = await wavePortalContract.wave("this is a message")
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance: ",hre.ethers.utils.formatEther(contractBalance) );

    // let waveCount = await waveContract.getTotalWaves();
    // console.log("WaveCount: ", waveCount);
    
    const firstWaveTxn = await waveContract.wave("First Wave");
    await firstWaveTxn.wait();

    // const secondWaveTxn = await waveContract.connect(randomPerson).wave("Second Wave");
    // await secondWaveTxn.wait();

    const thirdWaveTxn = await waveContract.wave("Third Wave");
    await thirdWaveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract Balance: ",hre.ethers.utils.formatEther(contractBalance) );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
}

const runMain = async () => {
    try {
      await main();
      process.exit(0); 
    } catch (error) {
      console.log(error);
      process.exit(1); 
    }
  };
  
  runMain();
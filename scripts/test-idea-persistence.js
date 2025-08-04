const { createPublicClient, http } = require("viem");
const { base } = require("wagmi/chains");

// FundBase contract ABI (simplified for testing)
const FUNDBASE_ABI = [
  {
    inputs: [],
    name: "getAllIdeas",
    outputs: [
      {
        components: [
          { name: "id", type: "string" },
          { name: "title", type: "string" },
          { name: "description", type: "string" },
          { name: "creator", type: "address" },
          { name: "totalRaisedETH", type: "uint256" },
          { name: "backerCount", type: "uint256" },
          { name: "createdAt", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

async function testIdeaPersistence() {
  try {
    console.log("🧪 Testing idea persistence functionality...");
    
    // Create public client
    const publicClient = createPublicClient({
      chain: base,
      transport: http(),
    });
    
    // Get contract address
    const contractAddress = "0x0CFB5CC7bf2019e8a0370933aafCF6fB55028411";
    if (!contractAddress) {
      console.error("❌ Contract address not configured");
      return;
    }
    
    console.log("📋 Contract address:", contractAddress);
    
    // Test getAllIdeas function
    console.log("🔍 Fetching ideas from blockchain...");
    const contractIdeas = await publicClient.readContract({
      address: contractAddress,
      abi: FUNDBASE_ABI,
      functionName: "getAllIdeas",
    });
    
    console.log("📊 Raw contract ideas:", contractIdeas);
    console.log("📊 Ideas count:", contractIdeas?.length || 0);
    
    if (contractIdeas && contractIdeas.length > 0) {
      console.log("📋 First idea structure:", contractIdeas[0]);
      console.log("📋 First idea type:", typeof contractIdeas[0]);
      console.log("📋 First idea is array:", Array.isArray(contractIdeas[0]));
      
      // Test transformation logic
      const transformedIdeas = contractIdeas
        .filter((idea) => {
          const isArray = Array.isArray(idea);
          const isObject = idea && typeof idea === 'object' && !Array.isArray(idea);
          
          console.log("🔍 Filtering idea:", idea);
          console.log("🔍 Is array:", isArray);
          console.log("🔍 Is object:", isObject);
          
          if (isArray) {
            const ideaArray = idea;
            const isValid = ideaArray && 
                   ideaArray.length >= 7 &&
                   typeof ideaArray[0] === 'string' && 
                   typeof ideaArray[1] === 'string' && 
                   typeof ideaArray[2] === 'string' &&
                   typeof ideaArray[3] === 'string' &&
                   (typeof ideaArray[4] === 'bigint' || typeof ideaArray[4] === 'number') &&
                   (typeof ideaArray[5] === 'number') &&
                   (typeof ideaArray[6] === 'number' || typeof ideaArray[6] === 'bigint');
            
            console.log("✅ Array validation result:", isValid);
            return isValid;
          } else if (isObject) {
            const ideaObj = idea;
            const hasRequiredProps = ideaObj.id && ideaObj.title && ideaObj.description && 
                                   ideaObj.creator && ideaObj.totalRaisedETH !== undefined && 
                                   ideaObj.backerCount !== undefined && ideaObj.createdAt !== undefined;
            
            console.log("✅ Object validation result:", hasRequiredProps);
            return hasRequiredProps;
          }
          
          return false;
        })
        .map((idea) => {
          console.log("🔄 Transforming idea:", idea);
          
          if (Array.isArray(idea)) {
            const ideaArray = idea;
            const transformed = {
              id: String(ideaArray[0] || ''),
              title: String(ideaArray[1] || ''),
              description: String(ideaArray[2] || ''),
              creator: String(ideaArray[3] || ''),
              totalRaisedETH: BigInt(typeof ideaArray[4] === 'number' || typeof ideaArray[4] === 'bigint' ? ideaArray[4] : 0),
              backerCount: Number(typeof ideaArray[5] === 'number' ? ideaArray[5] : 0),
              createdAt: Number(typeof ideaArray[6] === 'number' || typeof ideaArray[6] === 'bigint' ? ideaArray[6] : 0) * 1000,
            };
            
            console.log("✅ Transformed array idea:", transformed);
            return transformed;
          } else {
            const ideaObj = idea;
            const transformed = {
              id: String(ideaObj.id || ''),
              title: String(ideaObj.title || ''),
              description: String(ideaObj.description || ''),
              creator: String(ideaObj.creator || ''),
              totalRaisedETH: BigInt(typeof ideaObj.totalRaisedETH === 'bigint' || typeof ideaObj.totalRaisedETH === 'number' ? ideaObj.totalRaisedETH : 0n),
              backerCount: Number(ideaObj.backerCount || 0),
              createdAt: Number(ideaObj.createdAt || 0) * 1000,
            };
            
            console.log("✅ Transformed object idea:", transformed);
            return transformed;
          }
        })
        .filter(idea => idea.id !== "error" && idea.id !== "");
      
      console.log("🎉 Final transformed ideas:", transformedIdeas);
      console.log("🎉 Transformed ideas count:", transformedIdeas.length);
    } else {
      console.log("📭 No ideas found in contract");
    }
    
    console.log("✅ Test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run the test
testIdeaPersistence(); 
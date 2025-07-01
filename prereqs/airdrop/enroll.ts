import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./Turbin3-wallet.json";

// Constants
const MPL_CORE_PROGRAM_ID = new PublicKey(
  "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
);
const SYSTEM_PROGRAM_ID = SystemProgram.programId;

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

// Create our program
const program: Program<Turbin3Prereq> = new Program(IDL, provider);

// Create the PDA for our enrollment account
const account_seeds = [Buffer.from("prereqs"), keypair.publicKey.toBuffer()];
const [account_key, _account_bump] = PublicKey.findProgramAddressSync(
  account_seeds,
  program.programId
);

// Declare the address of the mint Collection
const mintCollection = new PublicKey(
  "5ebsp5RChCGK7ssRZMVMufgVZhd2kFbNaotcZ5UvytN2"
);

// Create the mint Account for the new asset
const mintTs = Keypair.generate();

// Execute the initialize transaction
async function initialize() {
  try {
    const txhash = await program.methods
      .initialize("easily-mistaken")
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair])
      .rpc();
    console.log(
      `Initialize Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
}

// Execute the submitTs transaction
async function submitTs() {
  try {
    const txhash = await program.methods
      .submitTs()
      .accountsPartial({
        user: keypair.publicKey,
        account: account_key,
        mint: mintTs.publicKey,
        collection: mintCollection,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([keypair, mintTs])
      .rpc();
    console.log(
      `SubmitTs Success! Check out your TX here: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
}

// Main execution
(async () => {
  console.log("Starting Turbin3 enrollment process...");
  console.log(`Using wallet: ${keypair.publicKey.toBase58()}`);
  console.log(`Program ID: ${program.programId.toBase58()}`);
  console.log(`Account PDA: ${account_key.toBase58()}`);

  // Run initialize first
  console.log("\n1. Running submitTs...");
  await submitTs();

  //   setTimeout(async () => {
  //     console.log("\n2. Running submitTs...");
  //     await submitTs();
  //   }, 15000);
})();

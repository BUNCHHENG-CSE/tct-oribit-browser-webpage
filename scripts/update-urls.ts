import { prisma } from "../lib/db";

async function run() {
  const assets = await prisma.releaseAsset.findMany();
  let count = 0;
  for (const a of assets) {
    let newUrl = a.fileUrl;
    if (newUrl.includes("downloads.tctorbit.com")) {
      newUrl = newUrl
        .replace(
          "https://downloads.tctorbit.com/releases/v0.1.2/",
          "https://github.com/arzurlab/tct-orbit-browser/releases/download/v0.1.2/"
        )
        .replace(
          "https://downloads.tctorbit.com/releases/nova/",
          "https://github.com/arzurlab/tct-orbit-browser/releases/download/v0.2.0-beta/"
        )
        .replace(
          "https://downloads.tctorbit.com/releases/deep/",
          "https://github.com/arzurlab/tct-orbit-browser/releases/download/nightly/"
        )
        .replace(
          "https://downloads.tctorbit.com/releases/canary/",
          "https://github.com/arzurlab/tct-orbit-browser/releases/download/canary/"
        );
    }
    if (newUrl.includes("tctorbit/orbit-browser")) {
      newUrl = newUrl.replaceAll("tctorbit/orbit-browser", "arzurlab/tct-orbit-browser");
    }

    if (newUrl !== a.fileUrl) {
      await prisma.releaseAsset.update({
        where: { id: a.id },
        data: { fileUrl: newUrl },
      });
      console.log(`Updated asset ${a.id} -> ${newUrl}`);
      count++;
    }
  }
  console.log(`Successfully updated ${count} assets to GitHub Releases URLs.`);
  await prisma.$disconnect();
}

run().catch(console.error);

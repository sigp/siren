const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(`Error executing command: ${command}\n${stderr}`)
        reject(error)
      } else {
        console.log(`Success executing command: ${command}\n${stdout}`)
        resolve(stdout)
      }
    })
  })
}

function isValidSemanticVersion(version) {
  const semVerPattern =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
  return semVerPattern.test(version)
}

function writeVersionToFile(version) {
  const filePath = path.resolve(__dirname, '../constants/version.ts')
  const content = "export const sirenVersion = 'v" + version + "';\n"

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Version file updated to v${version}`)
}

function executeGitCommand(command) {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}\n${stderr}`)
        reject(error)
      } else {
        console.log(`Success executing command: ${command}\n${stdout}`)
        resolve(stdout)
      }
    })

    setTimeout(() => {
      child.kill()
      reject(new Error(`Command timed out: ${command}`))
    }, 60000)
  })
}

async function safeExecuteGitCommand(command) {
  try {
    await executeGitCommand(command)
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

async function main() {
  const versionId = process.argv[2]

  if (!versionId) {
    console.error('Please provide a version ID as an argument.')
    return
  }

  if (!isValidSemanticVersion(versionId)) {
    console.error(
      'The provided version ID does not follow semantic versioning. Please provide a valid version ID.',
    )
    return
  }

  await safeExecuteGitCommand('git checkout unstable')
  await safeExecuteGitCommand('git pull')

  writeVersionToFile(versionId)
  await safeExecuteGitCommand('git add ../constants/version.ts')
  await safeExecuteGitCommand(
    `git commit --allow-empty -m "siren version updated: ${versionId}" --no-verify`,
  )
  await safeExecuteGitCommand('git push')

  await safeExecuteGitCommand('git checkout stable')
  await safeExecuteGitCommand('git merge --ff-only unstable')
  await safeExecuteGitCommand('git push origin stable')

  await safeExecuteGitCommand(`git tag v${versionId}`)
  await safeExecuteGitCommand(`git push origin v${versionId}`)

  console.log(`Successfully tagged and initiated release ${versionId}`)
  process.exit(1) // Exit the script on error
}

main()

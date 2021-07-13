import MainGrid from '../src/components/Main Grid'
import Box from '../src/components/Box'

function ProfileSidebar() {
  return (
    <Box>
        <img src={`https://github.com/${githubUser}.png`} style={{ borderRadius: '8px'}}/>
      </Box>
  )
}

export default function Home() {
  const githubUser = 'vinicius-godoy';
  
  return (
  <MainGrid>
    {/* <Box style="grid-area: profileArea;"> */}
    <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar />
    </div>
    <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
      <Box>
        Bem vindo
      </Box>
    </div>
    <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
      <Box>
        Pessoas da Comunidade
      </Box>
      <Box>
        Comunidades
      </Box>
    </div>
  </MainGrid>
  )
}

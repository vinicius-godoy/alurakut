import Box from '../Box'
import { AlurakutProfileSidebarMenuDefault } from '../../lib/AlurakutCommons';

function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
        <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}} />
        <hr />

        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>

        <hr />

        <AlurakutProfileSidebarMenuDefault githubUser={propriedades.githubUser} />
      </Box>
  )
}

export default ProfileSidebar
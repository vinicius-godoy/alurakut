import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../../src/lib/AlurakutCommons'

import MainGrid from '../../src/components/Main Grid'
import Box from '../../src/components/Box'
import ProfileSidebar from '../../src/components/ProfileSidebar'
import ProfileRelationsBoxWrapper from '../../src/components/ProfileRelations'
import ProfileRelationsBox from '../../src/components/ProfileRelationsBox'
import ProfileBox from '../../src/components/ProfileBox'
import { ScrapBox, NoScraps } from '../../src/components/ScrapBox'

export default function UserScreen(props) {
  const githubUser = props.githubUser
  
  const router = useRouter()
  const { user } = router.query
  const profileUser = user

  const [comunidades, setComunidades] = useState([])
  const [pesquisas, setPesquisas] = useState([])
  const [scraps, setScraps] = useState([])
  useEffect(() => {
    // API GraphQL - POST
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '01616f428a71a07ef78a335bc2182d',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query" : `query MyQuery {
        allScraps(filter: {scrapbookSlug: {matches: {pattern: "${profileUser}"}}}) {
          id
          message
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const scrapsVindasDoDato = respostaCompleta.data.allScraps
      console.log(scrapsVindasDoDato)
      setScraps(scrapsVindasDoDato)
    })
  }, [])
  const [perfilInfo, setPerfilInfo] = useState([])
  useEffect(function() {
    // API GitHub - GET
    const linkAPI = "https://api.github.com/users/" + profileUser
    fetch(linkAPI)
    .then((respostaDoServidor) => respostaDoServidor.json())
    .then((respostaConvertida) => {
      setPerfilInfo(respostaConvertida)
      console.log(perfilInfo)
    })
  }, [])
  // Quem segue o usuário
  const [seguidores, setSeguidores] = useState([])
  useEffect(function() {
    // API GitHub - GET
    const linkAPI = "https://api.github.com/users/" + githubUser + "/followers";
    fetch(linkAPI)
    .then(function (respostaDoServidor) {
      if(respostaDoServidor.ok){
        return respostaDoServidor.json();
      }

      throw new Error('Aconteceu um problema na API do Github :( - Código ' + respostaDoServidor.status);
    })
    .then(function (respostaConvertida) {
      setSeguidores(respostaConvertida);
    })
    .catch(function (erro) {
      console.log(erro);
    })

    // API GraphQL - POST
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '01616f428a71a07ef78a335bc2182d',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query" : `query {
        allCommunities {
          title
          id
          imageUrl
          link
          creatorSlug
        }
      }` })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesVindasDoDato = respostaCompleta.data.allCommunities
      console.log(comunidadesVindasDoDato)
      setComunidades(comunidadesVindasDoDato)
    })

  }, [])
  // Quem o usuário segue
  const [seguindo, setSeguindo] = useState([]);
  useEffect(function() {
    const linkAPI = "https://api.github.com/users/" + githubUser + "/following";
    fetch(linkAPI)
    .then(function (respostaDoServidor) {
      if(respostaDoServidor.ok){
        return respostaDoServidor.json();
      }

      throw new Error('Aconteceu um problema na API do Github :( - Código ' + respostaDoServidor.status);
    })
    .then(function (respostaConvertida) {
      if(respostaConvertida != null){
        setSeguindo(respostaConvertida);
      }
      
      throw new Error('A response da API do Github está vazia');
    })
    .catch(function (erro) {
      console.log(erro);
    })
  }, [])

  console.log(seguidores)
  console.log(seguindo)
  
  return(
    <>
    <AlurakutMenu githubUser={githubUser} pesquisas={pesquisas} setPesquisas={setPesquisas} />
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h2 className="title" >Perfil de {profileUser}</h2>
          <div style={{display: 'flex'}}>
            <img src={`https://github.com/${profileUser}.png`} style={{height: '12em', width: '12em', borderRadius: '10px', marginRight: '10px'}}/>
            <div>
              <ProfileBox>
                {perfilInfo.name 
                ? <h2>{perfilInfo.name}</h2>
                : <h2>{profileUser}</h2>}
                <div style={{display: 'flex', marginBottom: '5px', justifyContent: 'space-between'}}>
                  <span><strong>Seguidores: </strong>{perfilInfo.followers}</span>
                  <span><strong>Seguindo: </strong>{perfilInfo.following}</span>
                </div>
                <div style={{display: 'flex', marginBottom: '5px', justifyContent: 'space-between'}}>
                  <span><strong>Repositórios: </strong>{perfilInfo.public_repos}</span>
                  <span><strong>Gists: </strong>{perfilInfo.public_gists}</span>
                </div>
                {perfilInfo.bio 
                ? 
                <>
                <h4>Bio:</h4>
                <p>{perfilInfo.bio}</p>
                </>
                : 
                <>
                  <h4>Bio:</h4>
                  <p>Bem vindo a minha página do Alurakut!</p>
                </>}

                {perfilInfo.company 
                ? 
                <>
                <h4>Empresa:</h4>
                <p>{perfilInfo.company}</p>
                </>
                : null}
              </ProfileBox>
            </div>
          </div>
          <OrkutNostalgicIconSet recados = {scraps.length} fotos= "45" videos= "2" fas= "1" mensagens= "7" confiavel="3" legal="3" sexy="3" />
        </Box>

        <Box>
          <h2 className="subTitle">Recados de {profileUser} ({scraps.length})</h2>
          <p style={{marginBottom: '15px'}}>
          <a href="/">Início</a>
          <span> &gt; </span>
          <a href={`/user/${profileUser}`}>{profileUser}</a>
          <span> &gt; </span>
          <a style={{textDecoration: 'none', color: 'black'}} href={`/scrapbook/${profileUser}`}><strong>Recados</strong></a>
          </p>

          <ul>
            {scraps.length > 0 ?
            scraps.map((itemAtual) => {
              return (
                <ScrapBox>
                  <li key={itemAtual.id}>
                    <img src={`https://github.com/${itemAtual.creatorSlug}.png`} />
                    <div>
                      <a href={`/users/${itemAtual.creatorSlug}`} >@{itemAtual.creatorSlug}</a>
                      <p>{itemAtual.message}</p>
                    </div>
                  </li>
                </ScrapBox>
              )
            })
            : 
              <NoScraps>
                O usuário {profileUser} ainda não possui recados
              </NoScraps>
            }
          </ul>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
          <ul>
            {comunidades.filter((value) => {
              const nomeComunidade = value.title
              const nomePesquisa = nomeComunidade.substr(0, pesquisas.length)
              if(nomePesquisa.length == 0){
                return value
              }else{
                return nomePesquisa.toUpperCase() === pesquisas.toUpperCase()
              }
            }).slice(0,6).map((itemAtual) => {
              return (
                  <li key={itemAtual.id}>
                  <a href={`${itemAtual.link}`}>
                    <img src={itemAtual.imageUrl} />
                    <span>{itemAtual.title}</span>
                  </a>
                  </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBox title="Seguidores" itens={seguidores} />
        <ProfileRelationsBox title="Seguindo" itens={seguindo} />
      </div>
    </MainGrid>
  </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN
  console.log(cookies)
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((resposta) => resposta.json())

  console.log('isAuthenticated: ', isAuthenticated)

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token)
  return {
    props: {
      githubUser
    },
  }
}
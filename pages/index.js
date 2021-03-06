import React from 'react'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
import MainGrid from '../src/components/Main Grid'
import Box from '../src/components/Box'
import ProfileSidebar from '../src/components/ProfileSidebar'
import ProfileRelationsBoxWrapper from '../src/components/ProfileRelations'
import ProfileRelationsBox from '../src/components/ProfileRelationsBox'
import { 
  ScrapBox,
  NoScraps
} from '../src/components/ScrapBox'
import { 
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet
} from '../src/lib/AlurakutCommons'

export default function Home(props) {
  const githubUser = props.githubUser;
  const [scraps, setScraps] = React.useState([])
  React.useEffect(() => {
    // API GraphQL - POST
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '01616f428a71a07ef78a335bc2182d',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query" : `query MyQuery {
        allScraps(filter: {scrapbookSlug: {matches: {pattern: "${githubUser}"}}}) {
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
  const [comunidades, setComunidades] = React.useState([]);
  const [pesquisas, setPesquisas] = React.useState([]);
  // Quem segue o usuário
  const [seguidores, setSeguidores] = React.useState([]);
  React.useEffect(function() {
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
  const [seguindo, setSeguindo] = React.useState([]);
  React.useEffect(function() {
    const linkAPI = "https://api.github.com/users/" + githubUser + "/following";
    fetch(linkAPI)
    .then(function (respostaDoServidor) {
      if(respostaDoServidor.ok){
        return respostaDoServidor.json();
      }

      throw new Error('Aconteceu um problema na API do Github :( - Código ' + respostaDoServidor.status);
    })
    .then(function (respostaConvertida) {
      setSeguindo(respostaConvertida);
    })
    .catch(function (erro) {
      console.log(erro);
    })
  }, [])
  
  return (
  <>
    <AlurakutMenu githubUser={githubUser} pesquisas={pesquisas} setPesquisas={setPesquisas} />
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem vindo(a), {githubUser}
          </h1>

          <OrkutNostalgicIconSet recados = {scraps.length} fotos= "45" videos= "2" fas= "1" mensagens= "7" confiavel="3" legal="3" sexy="3" />
        </Box>

        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>
          <form name="form1" onSubmit={function handleCreateCommunity(e) {
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);
            document.form1.reset()

            console.log('Nome: ', dadosDoForm.get('title'));
            console.log('Link Capa: ', dadosDoForm.get('image'));
            console.log('Link Site: ', dadosDoForm.get('link'));

            if(dadosDoForm.get('title') != ''){
              let imagemComunidade = dadosDoForm.get('image');
              if(imagemComunidade === ''){
                console.log('Link Inválido');
                const imagemId = Math.floor(Math.random() * 99999) + 1;
                imagemComunidade = 'https://picsum.photos/200/300.jpg?' + imagemId;
              }

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: imagemComunidade,
                link: dadosDoForm.get('link'),
                creator_slug: githubUser
              };

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json()
                console.log(dados.registroCriado)
                const comunidade = dados.registroCriado
                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas)
              })
            }else{
              alert('Coloque um nome na comunidade!');}
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?" 
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?" 
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para usarmos de capa (Opcional)" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa (Opcional)" 
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para encaminharmos para sua comunidade (Opcional)" 
                name="link" 
                aria-label="Coloque uma URL para encaminharmos para sua comunidade (Opcional)" 
              />
            </div>

            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
        <Box>
          <h2 className="subTitle">Seus Recados ({scraps.length})</h2>
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
                Você ainda não possui recados
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
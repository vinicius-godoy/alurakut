import React from 'react';
import MainGrid from '../src/components/Main Grid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

// SideBar de Perfil
function ProfileSidebar(propriedades) {
  return (
    <Box as="aside">
        <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px'}} />
        <hr />

        <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>

        <hr />

        <AlurakutProfileSidebarMenuDefault />
      </Box>
  )
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.itens.length})
      </h2>
      <ul>
        {propriedades.itens.slice(0,6).map((itemAtual) => {
          return (
              <li key={itemAtual.id}>
              <a href={itemAtual.html_url}>
                <img src={itemAtual.avatar_url} />
                <span>{itemAtual.login}</span>
              </a>
              </li>
          )
        })}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const githubUser = 'vinicius-godoy';
  const [comunidades, setComunidades] = React.useState([]);
  // const comunidades = ['Alurakut'];
  const pessoasFavoritas = [
    'EnzoSchetine',
    'dev-st4rk',
    'arrooxa',
    'aarthificial',
    'filipedeschamps',
    'brunobertolini',
    'juunegreiros', 
    'omariosouto', 
    'peas', 
    'rafaballerini', 
    'marcobrunodev', 
    'felipefialho'
  ];
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
    <AlurakutMenu githubUser={githubUser} />
    <MainGrid>
      {/* <Box style="grid-area: profileArea;"> */}
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSidebar githubUser={githubUser}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem vindo(a), {githubUser}
          </h1>

          <OrkutNostalgicIconSet recados = "13" fotos= "45" videos= "2" fas= "1" mensagens= "7" confiavel="3" legal="3" sexy="3" />
        </Box>

        <Box>
          <h2 className="subTitle">O que você deseja fazer?</h2>
          <form onSubmit={function handleCreateCommunity(e) {
            e.preventDefault();
            const dadosDoForm = new FormData(e.target);

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

              // comunidades.push('Alura Stars');
              // const comunidadesAtualizadas = [...comunidades, comunidade];
              // setComunidades(comunidadesAtualizadas);
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
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>
          <ul>
            {comunidades.slice(0,6).map((itemAtual) => {
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
        {/* <ProfileRelationsBoxWrapper> Deixar comentado enquanto não for necessário na Imersão
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.slice(0,6).map((itemAtual) => {
              return (
                  <li key={itemAtual}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                  </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper> */}
      </div>
    </MainGrid>
  </>
  )
}

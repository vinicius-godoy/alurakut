import React from 'react';
import MainGrid from '../src/components/Main Grid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

// SideBar de Perfil
function ProfileSidebar(propriedades) {
  console.log(propriedades);
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

export default function Home() {
  const githubUser = 'vinicius-godoy';
  const [comunidades, setComunidades] = React.useState([{
    id: 143526463465793962592352345546,
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg',
    link: 'https://www.orkut.br.com/MainCommunity?cmm=10000'
  }]);
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
                id: new Date().toISOString(),
                title: dadosDoForm.get('title'),
                image: imagemComunidade,
                link: dadosDoForm.get('link')
              };

              console.log(comunidade);

              // comunidades.push('Alura Stars');
              const comunidadesAtualizadas = [...comunidades, comunidade];
              setComunidades(comunidadesAtualizadas);
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
                placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa" 
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para encaminharmos para sua comunidade" 
                name="link" 
                aria-label="Coloque uma URL para encaminharmos para sua comunidade" 
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
            {comunidades.map((itemAtual) => {
              return (
                  <li key={itemAtual.id}>
                  <a href={`${itemAtual.link}`}>
                    <img src={itemAtual.image} />
                    <span>{itemAtual.title}</span>
                  </a>
                  </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.map((itemAtual) => {
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
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
  </>
  )
}

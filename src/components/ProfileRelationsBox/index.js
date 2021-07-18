import ProfileRelationsBoxWrapper from '../ProfileRelations'

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

export default ProfileRelationsBox
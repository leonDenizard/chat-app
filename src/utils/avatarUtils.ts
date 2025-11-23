const AVALIABLE_AVATARS = [
    "/av1.png","/av2.png", "/av3.png", "/av4.png", "/av5.png", "/av6.png", "/av8.png", "/av9.png", "/av10.png", "/av11.png"
]

export function getRandomAvatar():string{
    const randomIndex = Math.floor(Math.random() * AVALIABLE_AVATARS.length)
    return AVALIABLE_AVATARS[randomIndex]
}
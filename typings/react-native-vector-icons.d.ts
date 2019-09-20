declare module 'react-native-vector-icons' {
  import { TextStyle } from 'react-native'

  export interface IconProperties {
    name: string
    size?: number
    color?: string
    style?: TextStyle
  }

  export interface BaseIcon extends React.Component<IconProperties> {
  }
}

declare module 'react-native-vector-icons/Entypo' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/EvilIcons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/FontAwesome' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/Foundation' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/Ionicons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/Ocitcons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/Zocial' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}

declare module 'react-native-vector-icons/SimpleLineIcons' {
  import { BaseIcon, IconProperties } from 'react-native-vector-icons'

  export default class Icon extends React.Component<IconProperties> implements BaseIcon {
  }
}
